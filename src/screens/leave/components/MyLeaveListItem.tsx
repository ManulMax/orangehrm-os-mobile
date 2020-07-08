/*
 * This file is part of OrangeHRM
 *
 * Copyright (C) 2020 onwards OrangeHRM (https://www.orangehrm.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {selectLeaveTypeColors} from 'store/leave/leave-usage/selectors';
import Text from 'components/DefaultText';
import Chip from 'components/DefaultChip';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {LeaveRequest} from 'store/leave/leave-usage/types';
import {sortLeaveArrayByDate, getBreakDown} from 'lib/helpers/leave';

class MyLeaveListItem extends React.Component<MyLeaveListItemProps> {
  getBreakDownString = () => {
    const {leaveRequest} = this.props;
    const breakDownArray = getBreakDown(
      sortLeaveArrayByDate(leaveRequest.days),
    );
    let text = '';
    breakDownArray.forEach((item) => {
      // TODO: localize `item.name`
      text += `${item.name}(${item.count.toFixed(2)}) `;
    });
    return text;
  };

  render() {
    const {theme, leaveRequest, leaveTypeColors, onPress} = this.props;
    const leaveTypeColor = leaveTypeColors[leaveRequest.leaveType];
    const leaveDates =
      leaveRequest.fromDate === leaveRequest.toDate
        ? leaveRequest.fromDate
        : leaveRequest.fromDate + ' to ' + leaveRequest.toDate;
    return (
      <>
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={{
              padding: theme.spacing * 3,
              paddingBottom: theme.spacing * 4,
            }}>
            <View style={styles.chipView}>
              <Chip
                style={[
                  {
                    paddingVertical: theme.spacing,
                    paddingHorizontal: theme.spacing * 3,
                    marginVertical: theme.spacing * 2,
                  },
                  leaveTypeColor
                    ? {backgroundColor: leaveTypeColor}
                    : undefined,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    leaveTypeColor
                      ? {color: theme.typography.lightColor}
                      : {color: theme.typography.darkColor},
                  ]}>
                  {leaveRequest.leaveType}
                </Text>
              </Chip>
            </View>
            <View style={{paddingHorizontal: theme.spacing * 2}}>
              <Text
                style={{
                  color: theme.palette.secondary,
                  paddingBottom: theme.spacing,
                }}>
                {leaveDates}
              </Text>
              <Text style={[{fontSize: theme.typography.smallFontSize}]}>
                {this.getBreakDownString()}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  }
}

interface MyLeaveListItemProps
  extends WithTheme,
    ConnectedProps<typeof connector>,
    Pick<TouchableWithoutFeedbackProps, 'onPress'> {
  leaveRequest: LeaveRequest;
}

const styles = StyleSheet.create({
  chipView: {
    alignItems: 'flex-start',
  },
});

const mapStateToProps = (state: RootState) => ({
  leaveTypeColors: selectLeaveTypeColors(state),
});

const connector = connect(mapStateToProps);

const MyLeaveListItemWithTheme = withTheme<MyLeaveListItemProps>()(
  MyLeaveListItem,
);

export default connector(MyLeaveListItemWithTheme);