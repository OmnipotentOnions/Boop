import React from 'react';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import * as Utils from '../utils/utils.js';

class displayAmbit extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      today: new Date(),

      //hardcoded data for mock-up purposes
      ambit: {weekdays: [true,true,false,true,false,true,true]}, //mon, wed, fri, sat, sun
      log: {"Sun Dec 11 2016": true, "Tue Dec 13 2016": true}
    }
  }

  dateInLog(date){
    if (this.state.log[date.toDateString()]){
      return true;
    } else {
      return false;
    }
  }

  render() {
    console.log(this.props.params.ambitNum);
    // test ambit populated from redux
    var testAmbit = this.props.markers[this.props.params.ambitNum];
    var startDate = new Date(this.state.today.toDateString());
    // sets startDate back 3 days
    startDate.setDate(startDate.getDate() - 3);
    console.log(startDate);

    var dates = [];
    for (var i = 0; i < 7; i++){
      var itemInfo = {};
      var itemDate = new Date(startDate);
      itemDate.setDate(itemDate.getDate() + i);

      itemInfo.date = itemDate;

      //if this list item's day of the week doesn't match ambit.weekdays
      if(testAmbit.weekdays[itemDate.getDay()] === false){
        itemInfo.status = 'Free';
      }
      else{
        //if this item's day matches weekdays,
        //and there is a check-in in the log for this date
        if (this.dateInLog(itemDate)){
          itemInfo.status = 'Accomplished';
        } else {
          //if there's no check-in and the item is for after today
          if (itemDate > this.state.today){
            itemInfo.status = 'Committed';
          } else{
            //if there's no check-in and the item is from before today
            itemInfo.status = 'Failed';
          }
        }
      }
      dates.push(itemInfo);
    }
    var listItems = dates.map(function(info){
      return(
        <ListItem primaryText={info.status} secondaryText={info.date.toDateString()}/>
      )
    });

    return(
      <List>
        {listItems}
      </List>
    );
  }
}

const mapStateToProps = (state) => ({
  markers : state.markers
});

displayAmbit = connect(mapStateToProps)(displayAmbit);

export default displayAmbit;