import React, { Component } from 'react'
import { Settings, Interval } from './pieces.js'
import hourglass from './Cursor/Hourglass.svg'
import alert from './slow-spring-board.mp3'
import Sound from 'react-sound'
import Moment from 'react-moment'
import oldMoment from 'moment'
import chrono from 'chrono-node'
import juration from 'juration'
import { extendMoment } from 'moment-range'
import Popup from 'react-popup'
import './App.css'

const moment = extendMoment(oldMoment)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start: moment("10:30 pm", "hh:mm a"),
      duration: moment.duration(3, 'hours'),
      reading: moment.duration(10, 'minutes'),
      activeInterval: 0,
      showConfig: false
    }
    // just a map I need for numbers/states
    this.interval = {
      notStarted: 0,
      reading: 1,
      writing: 2,
      finish: 3,
      unset: 4
    }
  }

  tick() {
    this.determineActiveInterval()
  }

  getMessage = () => {
    switch(this.state.activeInterval) {
      case this.interval.reading:
        return `Writing time starts ${moment(this.state.start).add(this.state.reading).fromNow()}`
      case this.interval.notStarted:
        return `We're starting ${this.state.start.fromNow()}`
      case this.interval.writing:
        return `We're finishing ${moment(this.state.start).add(this.state.duration).fromNow()}`
      case this.interval.finish:
        return "It's over bro"
    }
  }

  determineActiveInterval() {
    let now = moment()
    let activeInterval = 0
    let { start, duration, reading } = this.state
    let writingStart = moment(start).add(reading)

    let finish = moment(start).add(duration)
    let readingTime = moment.range(start, writingStart)
    let writingTime = moment.range(writingStart, finish)

    if (readingTime.contains(now))
      activeInterval = this.interval.reading
    else if (writingTime.contains(now))
      activeInterval = this.interval.writing
    else if (now.isAfter(finish))
      activeInterval = this.interval.finish

    // now finally set active interval in the state
    // if the state changed, make a noise
    if (activeInterval != this.state.activeInterval) {
      this.setState({ alert: true })
    }
    this.setState({ activeInterval })
  }

  handleInputChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  openConfig = () => {
    this.setState({ showConfig: true })
  }

  save = () => {
    const { eventName, durationTime, readingTime, startTime } = this.state
    // there's readingTime, durationTime, eventName
    if (!eventName)
      this.setState({ eventName: null })
    else {
      this.setState({ eventName })
    }
    if (durationTime) {
      // turn it into something real using chrono!
      try {
        let result = juration.parse(durationTime)
        let time = moment.duration(result, 'seconds')
        this.setState({ duration: time })
      } catch (e) {
        // just do nothing, lol
      }
    }

    if (readingTime) {
      let numSeconds = juration.parse(readingTime)
      let time = moment.duration(numSeconds, 'seconds')
      this.setState({ reading: time })
    }

    if (startTime) {
      try {
        let date = chrono.parseDate(startTime)
        this.setState({ start: moment(date) })
      } catch (e) {
        console.log("Date was messed up")
      }
    }
    // use what you got from the form to change the state variables
    this.setState({ showConfig: false })
  }

  cancel = () => {
    this.setState({ showConfig: false })
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000
    )
  }

  isActive(id) {
    return this.state.activeInterval === id
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }



  render() {
    return (
      <div className="App">
      <Sound
        url={alert}
        playStatus={this.state.alert ? Sound.status.PLAYING : Sound.status.STOPPED }
        onFinishedPlaying={() => this.setState({ alert: false })}></Sound>
        <header className="App-header">
          <img src={hourglass} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.eventName || 'Exam Timer'}</h1>
          <p>{ this.getMessage() } </p>
        </header>
        <div className="times">
          <div className="items">
          <h2><Moment interval={1} format="h:mm:ss a"/></h2>
            <Interval
              name="Reading"
              isActive={ this.isActive(this.interval.reading) }
              time={ this.state.start }
            />
            <Interval
              name="Writing"
              isActive={ this.isActive(this.interval.writing) }
              time={ moment(this.state.start).add(this.state.reading) }
            />
            <Interval
              name="Finish"
              isActive={ this.isActive(this.interval.finish) }
              time= { moment(this.state.start).add(this.state.duration) }
            />
          </div>
        </div>
          <div className="footer">
            <div onClick={ this.openConfig } className="button">Configure</div>
          </div>
          <Settings
            handleChange={ this.handleInputChange }
            show={ this.state.showConfig }
            onHide={ this.cancel }
            applyChanges={ this.save }
          />
        </div>
    )
  }
}

export default App;
