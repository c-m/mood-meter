"use strict";

import React from "react/addons";
import _ from "lodash";
import fetch from "node-fetch";
import Icon from "react-fa";
import classSet from "classnames";

let Mood = React.createClass({
  displayName: "Mood",

  getInitialState() {
    return {
      stressed_data: [],
      happy_data: []
    };
  },

  componentWillMount() {
    /*
      Endpoint response for timeseries
      {
        1428537600: 12,
        1428624000: 0,
        1428710400: 32
      }
    */
    const currentTime = Math.round(new Date().getTime() / 1000);
    const tenDays = 9 * 24 * 60 * 60;
    const tenDaysSinceNow = currentTime - tenDays;

    fetch(window.TIMESERIES + "?since=" + tenDaysSinceNow + "&message=stressed")
    .then((res) => {
        return res.json();
    }).then((json) => {
        let barData = [];

      Object.keys(json).map((k) => {
        barData.push({
          timeframe: parseInt(k),
          value: json[k]
        });
      });

      this.setState({
        stressed_data: barData
      });
    });

    fetch(window.TIMESERIES + "?since=" + tenDaysSinceNow + "&message=happy")
    .then((res) => {
        return res.json();
    }).then((json) => {
      let barData = [];

      Object.keys(json).map((k) => {
        barData.push({
          timeframe: parseInt(k),
          value: json[k]
        });
      });

      this.setState({
        happy_data: barData
      });
    });
  },

  render() {
    let sumListTotal = _.map(this.state.stressed_data, (data, index) => { return data.value + this.state.happy_data[index].value; });
    let sumHappyList = _.map(this.state.happy_data, (data, index) => { return data.value; });
    let sumTotal = _.sum(sumListTotal);
    let sumHappy = _.sum(sumHappyList);

    let pGreen = Math.round((sumHappy) / sumTotal * 100);
    let percentage = sumTotal === 0 ? "0%" : pGreen + "%";
    let bg = sumHappy === 0 && sumTotal === 0 ? "green" : "-webkit-radial-gradient(left center, circle farthest-corner, green " + percentage + ", red)";

    var gradientClass = classSet({
      "gradient-bg": true,
    });

    let style = {
      background: bg
    }

    return <div className="mood moodmeter-content">
      <div className={gradientClass} style={style} > </div>
    </div>
  }

});

export default Mood;
