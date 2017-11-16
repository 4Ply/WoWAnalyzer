import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { push as pushAction } from 'react-router-redux';

import { ApiDownError, LogNotFoundError } from 'common/fetchWcl';
import fetchEvents from 'common/fetchEvents';
import AVAILABLE_CONFIGS from 'Parser/AVAILABLE_CONFIGS';
import UnsupportedSpec from 'Parser/UnsupportedSpec/CONFIG';

import { fetchReport as fetchReportAction } from 'actions/report';
import { fetchCombatants as fetchCombatantsAction } from 'actions/combatants';
import { getReportCode, getFightId, getPlayerName } from 'selectors/routing';
import { getReport } from 'selectors/report';
import { getFightById } from 'selectors/fight';
import { getCombatants } from 'selectors/combatants';

import './App.css';

import ApiDownBackground from './Images/api-down-background.gif';
import ThunderSoundEffect from './Audio/Thunder Sound effect.mp3';

import Home from './Home';
import FightSelecter from './FightSelecter';
import PlayerSelecter from './PlayerSelecter';
import Results from './Results';
import ReportSelecter from './ReportSelecter';
import AppBackgroundImage from './AppBackgroundImage';
import FullscreenError from './FullscreenError';
import NavigationBar from './Layout/NavigationBar';
import DocumentTitleUpdater from './Layout/DocumentTitleUpdater';

import makeAnalyzerUrl from './makeAnalyzerUrl';

const timeAvailable = console.time && console.timeEnd;

const PROGRESS_STEP1_INITIALIZATION = 0.02;
const PROGRESS_STEP2_FETCH_EVENTS = 0.13;
const PROGRESS_STEP3_PARSE_EVENTS = 0.99;

/* eslint-disable no-alert */

class App extends Component {
  static propTypes = {
    reportCode: PropTypes.string,
    playerName: PropTypes.string,
    fightId: PropTypes.number,
    report: PropTypes.shape({
      title: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }),
    fight: PropTypes.shape({
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
      boss: PropTypes.number.isRequired,
    }),
    combatants: PropTypes.arrayOf(PropTypes.shape({
      sourceID: PropTypes.number.isRequired,
    })),
    fetchReport: PropTypes.func,
    fetchCombatants: PropTypes.func,
    push: PropTypes.func,
  };
  static childContextTypes = {
    config: PropTypes.object,
  };

  // Parsing a fight for a player is a "job", if the selected player or fight changes we want to stop parsing it. This integer gives each job an id that if it mismatches stops the job.
  _jobId = 0;
  get isReportValid() {
    return this.props.report && this.props.report.code === this.props.reportCode;
  }

  getPlayerFromReport(report, playerName) {
    const fetchByNameAttempt = report.friendlies.find(friendly => friendly.name === playerName);
    if (!fetchByNameAttempt) {
      return report.friendlies.find(friendly => friendly.id === Number(playerName));
    }
    return fetchByNameAttempt;
  }
  getPlayerPetsFromReport(report, playerId) {
    return report.friendlyPets.filter(pet => pet.petOwner === playerId);
  }

  constructor() {
    super();
    this.state = {
      selectedSpec: null,
      progress: 0,
      dataVersion: 0,
      bossId: null,
      config: null,
      fatalError: null,
    };

    this.handleReportSelecterSubmit = this.handleReportSelecterSubmit.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }
  getChildContext() {
    return {
      config: this.state.config,
    };
  }

  handleReportSelecterSubmit(reportInfo) {
    console.log('Selected report:', reportInfo['code']);
    console.log('Selected fight:', reportInfo['fight']);
    console.log('Selected player:', reportInfo['player']);

    if (reportInfo['code']) {
      let constructedUrl = `report/${reportInfo['code']}`;
      
      if (reportInfo['fight']) {
        constructedUrl += `/${reportInfo['fight']}`;
        
        if (reportInfo['player']) {
          constructedUrl += `/${reportInfo['player']}`;
        }
      }

      this.props.push(constructedUrl);
    }
  }

  handleRefresh() {
    this.props.fetchReport(this.props.reportCode, true);
  }

  getConfig(specId) {
    let config = AVAILABLE_CONFIGS.find(config => config.spec.id === specId);
    if (!config) {
      config = UnsupportedSpec;
    }
    return config;
  }
  createParser(ParserClass, report, fight, player) {
    const playerPets = this.getPlayerPetsFromReport(report, player.id);

    return new ParserClass(report, player, playerPets, fight);
  }
  async fetchEventsAndParse(report, fight, combatants, combatant, player) {
    // We use the setState callback for triggering UI updates to allow our CSS animations to work

    await this.setStatePromise({
      progress: 0,
    });
    const config = this.getConfig(combatant.specID);
    timeAvailable && console.time('full parse');
    const parser = this.createParser(config.parser, report, fight, player);
    // We send combatants already to the analyzer so it can show the results page with the correct items and talents while waiting for the API request
    parser.initialize(combatants);
    await this.setStatePromise({
      config,
      parser,
      progress: PROGRESS_STEP1_INITIALIZATION,
    });
    await this.parse(parser, report, player, fight);
  }
  async parse(parser, report, player, fight) {
    this._jobId += 1;
    const jobId = this._jobId;
    let events;
    try {
      this.startFakeNetworkProgress();
      events = await fetchEvents(report.code, fight.start_time, fight.end_time, player.id);
      this.stopFakeNetworkProgress();
    } catch (err) {
      window.Raven && window.Raven.captureException(err); // eslint-disable-line no-undef
      this.stopFakeNetworkProgress();
      if (process.env.NODE_ENV === 'development') {
        // Something went wrong while fetching the events, this usually doesn't have anything to do with a spec analyzer but is a core issue.
        throw err;
      } else {
        alert(`The report could not be parsed because an error occured. Warcraft Logs might be having issues. ${err.message}`);
        console.error(err);
      }
    }
    try {
      events = parser.normalize(events);
      await this.setStatePromise({
        progress: PROGRESS_STEP2_FETCH_EVENTS,
      });

      const batchSize = 300;
      const numEvents = events.length;
      let offset = 0;

      while (offset < numEvents) {
        if (this._jobId !== jobId) {
          return;
        }
        const eventsBatch = events.slice(offset, offset + batchSize);
        parser.parseEvents(eventsBatch);
        // await-ing setState does not ensure we wait until a render completed, so instead we wait 1 frame
        const progress = Math.min(1, (offset + batchSize) / numEvents);
        this.setState({
          progress: PROGRESS_STEP2_FETCH_EVENTS + (PROGRESS_STEP3_PARSE_EVENTS - PROGRESS_STEP2_FETCH_EVENTS) * progress,
          dataVersion: this.state.dataVersion + 1, // each time we parsed events we want to refresh the report, progress might not have updated
        });
        await this.timeout(1000 / 60);

        offset += batchSize;
      }

      parser.triggerEvent('finished');
      timeAvailable && console.timeEnd('full parse');
      this.setState({
        progress: 1.0,
      });
    } catch (err) {
      window.Raven && window.Raven.captureException(err);
      if (process.env.NODE_ENV === 'development') {
        // Something went wrong during the analysis of the log, there's probably an issue in your analyzer or one of its modules.
        throw err;
      } else {
        alert(`The report could not be parsed because an error occured while running the analysis. ${err.message}`);
        console.error(err);
      }
    }
  }
  _isFakeNetworking = false;
  async startFakeNetworkProgress() {
    this._isFakeNetworking = true;
    const expectedDuration = 5000;
    const stepInterval = 50;

    const jobId = this._jobId;

    let step = 1;
    while (this._isFakeNetworking) {
      if (this._jobId !== jobId) {
        // This could happen when switching players/fights while still loading another one
        break;
      }
      const progress = Math.min(1, step * stepInterval / expectedDuration);
      this.setState({
        progress: PROGRESS_STEP1_INITIALIZATION + ((PROGRESS_STEP2_FETCH_EVENTS - PROGRESS_STEP1_INITIALIZATION) * progress),
      });
      await this.timeout(stepInterval);
      step += 1;
    }
  }
  stopFakeNetworkProgress() {
    this._isFakeNetworking = false;
  }
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchCombatantsForFight(report, fight) {
    try {
      return this.props.fetchCombatants(report.code, fight.start_time, fight.end_time);
    } catch (err) {
      window.Raven && window.Raven.captureException(err);
      // TODO: Redirect to homepage
      // TODO: Show proper error page
      alert(err);
      console.error(err);
      this.reset();
    }
  }

  reset() {
    this._jobId += 1;
    this.setState({
      config: null,
      parser: null,
      progress: 0,
    });
    this.stopFakeNetworkProgress();
  }

  componentWillMount() {
    if (this.props.reportCode) {
      this.props.fetchReport(this.props.reportCode)
        .catch(err => {
          if (err instanceof ApiDownError || err instanceof LogNotFoundError) {
            this.reset();
            this.setState({
              fatalError: err,
            });
          } else {
            Raven && Raven.captureException(err); // eslint-disable-line no-undef
            alert(`I'm so terribly sorry, an error occured. Try again later, in an updated Google Chrome and make sure that Warcraft Logs is up and functioning properly. Please let us know on Discord if the problem persists.\n\n${err}`);
            console.error(err);
          }
        });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    ReactTooltip.rebuild();

    this.fetchReportIfNecessary(prevProps);
    this.fetchCombatantsIfNecessary(prevProps, prevState);
    this.fetchEventsAndParseIfNecessary(prevProps, prevState);
    this.updateBossIdIfNecessary(prevProps, prevState);
  }
  fetchReportIfNecessary(prevProps) {
    if (this.props.reportCode && this.props.reportCode !== prevProps.reportCode) {
      this.props.fetchReport(this.props.reportCode);
    }
  }
  fetchCombatantsIfNecessary(prevProps, prevState) {
    if (this.isReportValid && this.props.fight && (this.props.report !== prevProps.report || this.props.fight !== prevProps.fight)) {
      // A report has been loaded, it is the report the user wants (this can be a mismatch if a new report is still loading), a fight was selected, and one of the fight-relevant things was changed
      this.fetchCombatantsForFight(this.props.report, this.props.fight);
    }
  }
  fetchEventsAndParseIfNecessary(prevProps, prevState) {
    const changed = this.props.report !== prevProps.report
      || this.props.combatants !== prevProps.combatants
      || this.props.fightId !== prevProps.fightId
      || this.props.playerName !== prevProps.playerName;
    if (changed) {
      this.reset();

      const report = this.props.report;
      const fight = this.props.fight;
      const combatants = this.props.combatants;
      const playerName = this.props.playerName;
      const valid = report && fight && combatants && playerName;
      if (valid) {
        const player = this.getPlayerFromReport(report, playerName);
        if (!player) {
          alert(`Unknown player: ${playerName}`);
          return;
        }
        const combatant = combatants.find(combatant => combatant.sourceID === player.id);
        if (!combatant) {
          alert('This player does not seem to be in this fight.');
          return;
        }
        this.fetchEventsAndParse(report, fight, combatants, combatant, player);
      }
    }
  }
  updateBossIdIfNecessary(prevProps, prevState) {
    if (this.props.reportCode !== prevProps.reportCode || this.props.report !== prevProps.report || this.props.fightId !== prevProps.fightId) {
      this.updateBossId();
    }
  }

  updateBossId() {
    this.setState({
      bossId: (this.props.reportCode && this.isReportValid && this.props.fight && this.props.fight.boss) || null,
    });
  }

  renderContent() {
    const { parser } = this.state;
    const { report } = this.props;

    if (this.state.fatalError) {
      if (this.state.fatalError instanceof ApiDownError) {
        return (
          <FullscreenError
            error="The API is down."
            details="This is usually because we're leveling up with another patch."
            background={ApiDownBackground}
          >
            <div className="text-muted">
              Aside from the great news that you'll be the first to experience something new that is probably going to pretty amazing, you'll probably also enjoy knowing that our updates usually only take about 10 seconds. So just <a href={window.location.href}>give it another try</a>.
            </div>
            {/* I couldn't resist */}
            <audio autoPlay>
              <source src={ThunderSoundEffect} />
            </audio>
          </FullscreenError>
        );
      }
      if (this.state.fatalError instanceof LogNotFoundError) {
        return (
          <FullscreenError
            error="Log not found."
            details="Either you entered a wrong report, or it is private."
            background="https://media.giphy.com/media/DAgxA6qRfa5La/giphy.gif"
          >
            <div className="text-muted">
              Private logs can not be used, if your guild has private logs you will have to <a href="https://www.warcraftlogs.com/help/start/">upload your own logs</a> or change the existing logs to the <i>unlisted</i> privacy option instead.
            </div>
            <div>
              <button type="button" className="btn btn-primary" onClick={() => {
                this.setState({ fatalError: null });
                this.props.push(makeAnalyzerUrl());
              }}>
                &lt; Back
              </button>
            </div>
          </FullscreenError>
        );
      }
    }
    if (!this.props.reportCode) {
      return <Home />;
    }

    if (!report) {
      return (
        <div>
          <h1>Fetching report information...</h1>

          <div className="spinner" />
        </div>
      );
    }
    if (!this.props.fightId) {
      return <FightSelecter onRefresh={this.handleRefresh} />;
    }
    if (!this.props.playerName) {
      return <PlayerSelecter />;
    }
    if (!parser) {
      return null;
    }

    return (
      <Results
        parser={parser}
        dataVersion={this.state.dataVersion}
        onChangeTab={newTab => this.props.push(makeAnalyzerUrl(report, this.props.fightId, this.props.playerName, newTab))}
      />
    );
  }

  async setStatePromise(newState) {
    return new Promise((resolve, reject) => {
      this.setState(newState, resolve);
    });
  }

  render() {
    const { reportCode } = this.props;
    const { parser, progress } = this.state;

    // Treat `fatalError` like it's a report so the header doesn't pop over the shown error
    const hasReport = reportCode || this.state.fatalError;

    return (
      <div className={`app ${hasReport ? 'has-report' : ''}`}>
        <AppBackgroundImage bossId={this.state.bossId} />

        <NavigationBar
          parser={parser}
          progress={progress}
        />
        <header>
          <div className="container hidden-md hidden-sm hidden-xs">
            Analyze your performance
          </div>
          {!reportCode && (
            <ReportSelecter onSubmit={this.handleReportSelecterSubmit} />
          )}
        </header>
        <main className="container">
          {this.renderContent()}
        </main>
        <ReactTooltip html place="bottom" />
        <DocumentTitleUpdater />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const fightId = getFightId(state);

  return ({
    reportCode: getReportCode(state),
    fightId,
    playerName: getPlayerName(state),

    report: getReport(state),
    fight: getFightById(state, fightId),
    combatants: getCombatants(state),
  });
};

export default connect(
  mapStateToProps,
  {
    fetchReport: fetchReportAction,
    fetchCombatants: fetchCombatantsAction,
    push: pushAction,
  }
)(App);
