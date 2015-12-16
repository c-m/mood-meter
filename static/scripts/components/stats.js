"use strict";

import React from "react";
import _ from "lodash";
import fetch from "node-fetch";
import moment from "moment";
import classSet from "classnames";
import Icon from "react-fa";

let Stats = React.createClass({
  displayName: "Stats",

  statics: {
    DATE_FORMAT: "Do MMMM YY"
  },

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
    return <div className="stats">
      {!_.isEmpty(this.state.stressed_data) || !_.isEmpty(this.state.happy_data) ? this.renderBarColumn() : null}
    </div>;
  },

  renderBarColumn() {
    let sumList = _.map(this.state.stressed_data, (data, index) => { return data.value + this.state.happy_data[index].value; });
    let maxSum = _.max(sumList);
    return _.map(this.state.stressed_data, (data, index) => {
      let happyValue = this.state.happy_data[index].value;
      let pValue = Math.round((data.value + happyValue) / maxSum * 100);
      let barHeight = pValue + "%";
      let heightFinal = pValue < 10 ? "10%" : barHeight
      let style = {
        height: data.value === 0 && happyValue === 0 ? "100%" : heightFinal
      };
      let barClasses = classSet({
        "bar": true,
        "bar-with-no-value": data.value === 0 && happyValue === 0
      });

      return <div key={index}
                  className={barClasses}>
        <div className="bar-column">
          <div className="value" style={style}>
            <ul>
              <li>{<Icon name="meh-o" />} {data.value}</li>
              <li>{<Icon name="smile-o" />} {happyValue}</li>
            </ul>
          </div>
        </div>
        <div className="date">
          {moment.utc(data.timeframe, 'X').format(this.constructor.DATE_FORMAT)}
        </div>
      </div>
    });
  }
});


export default Stats;
