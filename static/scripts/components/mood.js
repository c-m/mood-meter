"use strict";

import React from "react/addons";
import fetch from "node-fetch";
import Icon from "react-fa";
import classSet from "classnames";

let Mood = React.createClass({
  displayName: "Mood",

  getInitialState() {
    return {
      isLoadingLeft: false,
      isMoodSetLeft: false,
      isLoadingRight: false,
      isMoodSetRight: false
    };
  },

  render() {
    let isLoadingLeft = this.state.isLoadingLeft,
        isMoodSetLeft = this.state.isMoodSetLeft,
        isLoadingRight = this.state.isLoadingRight,
        isMoodSetRight = this.state.isMoodSetRight;

    var buttonClassesLeft = classSet({
      "mood-button-left": true,
      "loading": isLoadingLeft,
      "success": isMoodSetLeft
    });

    var buttonClassesRight = classSet({
      "mood-button-right": true,
      "loading": isLoadingRight,
      "success": isMoodSetRight
    });

    return <div className="mood moodmeter-content">
      <button className={buttonClassesLeft}
            disabled={isLoadingLeft || isMoodSetLeft || isLoadingRight || isMoodSetRight}
            onClick={!isLoadingLeft ? this.setStatusLeft : null}>
        {isLoadingLeft ? <Icon spin name="circle-o-notch" />
                   : isMoodSetLeft ? <Icon name="check-circle" />
                               : <Icon name="meh-o" />}
      </button>
      <button className={buttonClassesRight}
             disabled={isLoadingRight || isMoodSetRight || isLoadingLeft || isMoodSetLeft}
             onClick={!isLoadingRight ? this.setStatusRight : null}>
        {isLoadingRight ? <Icon spin name="circle-o-notch" />
                   : isMoodSetRight ? <Icon name="check-circle" />
                               : <Icon name="smile-o" />}
      </button>
    </div>
  },

  setStatusLeft() {
    // Replace button state
    this.setState({
        isLoadingLeft: true
    });

    let moodMessage = { message: "stressed" };

    fetch(window.STATUSES, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moodMessage)
    }).then((res) => {
      setTimeout(() => {

        // Completed of async action, set loading state back
        this.setState({
          isLoadingLeft: false,
          isMoodSetLeft: true
        });
      }, 2000);
    });
},

setStatusRight() {
  // Replace button state
  this.setState({
      isLoadingRight: true
  });

  let moodMessage = { message: "happy" };

  fetch(window.STATUSES, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(moodMessage)
  }).then((res) => {
    setTimeout(() => {

      // Completed of async action, set loading state back
      this.setState({
        isLoadingRight: false,
        isMoodSetRight: true
      });
    }, 2000);
  });
}

});

export default Mood;
