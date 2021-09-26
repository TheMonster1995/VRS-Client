import react, { Component } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import DatePicker from "react-datepicker";
import { BeatLoader } from 'react-spinners';
import { Chart } from 'react-google-charts'

import {
  checkSignIn,
  getCosts
} from '../actions';

import {
  numberNormalizer
} from '../helper';

class Reports extends Component {
  state = {
    orders: [],
    costs: [],
    chart: false,
    fromRange: null,
    toRange: null,
    filterCalled: false,
    dateChanged: false
  }

  componentDidMount() {
    if (!this.props.costsCalled) return this.props.getCosts();
    if (this.props.costsCalled && this.props.ordersCalled) return this.dateRangeFilter();
  }

  componentDidUpdate() {
    if (!this.props.costsCalled) return this.props.getCosts();

    if (this.props.ordersCalled && !this.state.filterCalled) return this.dateRangeFilter();

    if (this.state.dateChanged) return this.dateRangeFilter();
  }

  capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

  dateRangeFilter = () => {
    let orders = this.props.orders;
    let costs = this.props.costs;

    if (!orders || !costs) return this.setState({orders: [], costs: []});

    let fromDate, toDate, received, oResult, cResult, startDate, endDate, monthCount, average;

    if (
      this.state.fromRange &&
      this.state.toRange
    ) {
      fromDate = new Date(this.state.fromRange);
      toDate = new Date(this.state.toRange);
      oResult = orders.filter(order => {
        received = new Date(order.order.received_date_time);
        if (
          received.getTime() >= fromDate.getTime() &&
          received.getTime() <= toDate.getTime()
        ) return true;

        return false;
      })

      cResult = costs.filter(cost => {
        startDate = new Date(cost.from);
        endDate = new Date(cost.to);

        if (
          (
            startDate.getTime() >= fromDate.getTime() &&
            startDate.getTime() <= toDate.getTime()
          ) ||
          (
            endDate.getTime() >= fromDate.getTime() &&
            endDate.getTime() <= toDate.getTime()
          )
        ) return true;

        return false;
      })

      cResult = cResult.map(cost => {
        startDate = new Date(cost.from);
        endDate = new Date(cost.to);

        if (
          startDate.getTime() >= fromDate.getTime() &&
          endDate.getTime() <= toDate.getTime()
        ) return cost;

        monthCount = (endDate.getMonth() - startDate.getMonth()) + 1;

        average = parseFloat(cost.total) / monthCount;

        return {
          ...cost,
          average
        }
      })

      return this.setState({orders: oResult, costs: cResult, filterCalled: true, dateChanged: false})
    }

    if (this.state.fromRange) {
      fromDate = new Date(this.state.fromRange);

      oResult = orders.filter(order => {
        received = new Date(order.order.received_date_time);
        if (received.getTime() >= fromDate.getTime()) return true;

        return false;
      })

      cResult = costs.filter(cost => {
        endDate = new Date(cost.to);

        if (endDate.getTime() >= fromDate.getTime()) return true;

        return false;
      })

      cResult = cResult.map(cost => {
        startDate = new Date(cost.from);

        if (startDate.getTime() >= fromDate.getTime()) return cost;

        endDate = new Date(cost.to);

        monthCount = (endDate.getMonth() - startDate.getMonth()) + 1;

        average = parseFloat(cost.total) / monthCount;

        return {
          ...cost,
          average
        }
      })

      return this.setState({orders: oResult, costs: cResult, filterCalled: true, dateChanged: false})
    }

    if (this.state.toRange) {
      toDate = new Date(this.state.toRange);

      oResult = orders.filter(order => {
        received = new Date(order.order.received_date_time);
        if (received.getTime() <= toDate.getTime()) return true;

        return false;
      })

      cResult = costs.filter(cost => {
        startDate = new Date(cost.from);

        if (startDate.getTime() <= toDate.getTime()) return true;

        return false;
      })

      cResult = cResult.map(cost => {
        endDate = new Date(cost.to);

        if (endDate.getTime() <= toDate.getTime()) return cost;

        startDate = new Date(cost.from);

        monthCount = (endDate.getMonth() - startDate.getMonth()) + 1;

        average = parseFloat(cost.total) / monthCount;

        return {
          ...cost,
          average
        }
      })

      return this.setState({orders: oResult, costs: cResult, filterCalled: true, dateChanged: false})
    }

    return this.setState({orders: [...orders], costs: [...costs], filterCalled: true, dateChanged: false})
  }

  generateTableInfo = () => {
    let orders = this.state.orders;
    let mCosts = this.state.costs;

    let ordersNum = orders.length,
      sale = 0,
      costs = 0,
      netWorth = 0,
      partsNum = 0;

    orders.forEach(order => {
      sale = sale + parseFloat(order.order.total_fee);
      costs = costs + parseFloat(order.shopOrder.total_fee);
      netWorth = netWorth + (parseFloat(order.order.total_fee) - parseFloat(order.shopOrder.total_fee));

      let orderParts = 0;

      order.order.parts.forEach(part => {orderParts = orderParts + parseFloat(part.qty)});

      partsNum = partsNum + orderParts;
    });

    mCosts.forEach(cost => {
      let tempAmount = cost.average ? parseFloat(cost.average) : parseFloat(cost.total);
      costs = costs + tempAmount;
      netWorth = netWorth - tempAmount;
    });

    return {
      ordersNum: numberNormalizer(ordersNum),
      sale: numberNormalizer(sale),
      costs: numberNormalizer(costs),
      netWorth: numberNormalizer(netWorth, -Infinity),
      partsNum: numberNormalizer(partsNum)
    }
  }

  generateTableData = () => {
    if (!this.props.orders) return [];
    let items = [];

    let reportsInfo = this.generateTableInfo();

    items.push({
      title: 'Total number of orders',
      total: reportsInfo.ordersNum
    })

    items.push({
      title: 'Total amount of sales',
      total: reportsInfo.sale
    })

    items.push({
      title: 'Total amount of costs',
      total: reportsInfo.costs
    })

    items.push({
      title: 'Total net worth',
      total: reportsInfo.netWorth
    })

    items.push({
      title: 'Total number of parts sold',
      total: reportsInfo.partsNum
    })

    return items;
  }

  generateReportsRows = () => {
    let items = this.generateTableData();

    return items.map((item, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{item.title}</td>
        <td>{item.total}</td>
      </tr>
    ))
  }

  dateCal = (orders, t) => {
    let min, max;
    if (t === 'from') {
      min = new Date(orders[0].order.received_date_time);

      orders.forEach(order => {
        let d = new Date(order.order.received_date_time);

        if (d.getTime() < min.getTime()) min = d;
      });

      return min;
    }

    max = new Date(orders[0].order.received_date_time);

    orders.forEach(order => {
      let d = new Date(order.order.received_date_time);

      if (d.getTime() > max.getTime()) max = d;
    });

    return max;
  }

  nwCal = (d, t) => {
    let res = 0;
    let date = new Date(d);
    let orders, costs;

    if (t === 'm') {
      orders = this.state.orders.filter(order => {
        let received = new Date(order.order.received_date_time);

        if (received.getMonth() === date.getMonth()) return true;

        return false;
      })

      orders.forEach(order => res = res + (parseFloat(order.order.total_fee) - parseFloat(order.shopOrder.total_fee)));

      return res;
    }

    orders = this.state.orders.filter(order => {
      let received = new Date(order.order.received_date_time);

      if (received.getFullYear() === date.getFullYear()) return true;

      return false;
    })

    orders.forEach(order => res = res + (parseFloat(order.order.total_fee) - parseFloat(order.shopOrder.total_fee)));

    costs = this.state.costs.filter(cost => {
      let fromDate = new Date(cost.from);

      if (fromDate.getFullYear() === date.getFullYear()) return true;

      return false;
    })

    costs = costs.map(cost => {
      let toDate = new Date(cost.to);

      if (toDate.getFullYear() === date.getFullYear()) return cost;

      let fromDate = new Date(cost.from);

      let monthCount = (toDate.getMonth() - fromDate.getMonth()) + 1;

      let average = parseFloat(cost.total) / monthCount;

      return {
        ...cost,
        average: numberNormalizer(average)
      }
    })

    costs.forEach(cost => res = cost.average ? (res - cost.average) : res - parseFloat(cost.total))

    return res;
  }

  generateChartsData = () => {
    let orders = this.state.orders;

    if (orders.length === 0) return [];

    let monthlyData = {
      title: 'Monthly net worth (without monthly costs)',
      data: [['Month', 'Montly net worth']]
    };
    let yearlyData = {
      title: 'Yearly net worth',
      data: [['Year', 'Yearly net worth']]
    };

    let monthDict = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    }
    let fromDate = this.state.fromRange ? new Date(this.state.fromRange) : this.dateCal(orders, 'from');
    let toDate = this.state.toRange ? new Date(this.state.toRange) : this.dateCal(orders, 'to');
    let monthCount, yearCount;

    monthCount = toDate.getMonth() - fromDate.getMonth();
    yearCount = toDate.getFullYear() - fromDate.getFullYear();

    for (let i = 0; i <= monthCount; i++) {
      let fromDTemp = new Date(fromDate);
      fromDTemp.setMonth(fromDTemp.getMonth() + i);
      let nwTemp = this.nwCal(fromDTemp, 'm');
      monthlyData.data.push([monthDict[fromDTemp.getMonth()], nwTemp]);
    }

    for (let i = 0; i <= yearCount; i++) {
      let fromDTemp = new Date(fromDate);
      fromDTemp.setYear(fromDTemp.getFullYear() + i);
      let nwTemp = this.nwCal(fromDTemp, 'y');
      yearlyData.data.push([fromDTemp.getFullYear().toString(), nwTemp]);
    }

    return [monthlyData, yearlyData];
  }

  generateCharts = () => {
    let items = this.generateChartsData();

    return items.map((item, i) => (
      <div key={i}>
        <Chart
          width={'768px'}
          height={'500px'}
          chartType="ColumnChart"
          loader={<div className='text-center'> <BeatLoader loading={true} color='#4b93ff' size={12} /> </div>}
          data={[...item.data]}
          options={{
            title: item.title,
            chartArea: { width: '65%' },
            hAxis: {
              minValue: 0,
            },
            vAxis: {
              title: 'Total networth',
            },
          }}
        />
      </div>
    ))

    // return (
    //   <div>
    //     <Chart
    //       width={'500px'}
    //       height={'300px'}
    //       chartType="ColumnChart"
    //       loader={<div className='text-center'> <BeatLoader loading={true} color='#4b93ff' size={12} /> </div>}
    //       data={[
    //         ['Month', 'Total networth'],
    //         ['Jun', 8175000],
    //         ['Jul', 3792000],
    //         ['Aug', 9695000],
    //       ]}
    //       options={{
    //         title: 'Monthly net worth',
    //         chartArea: { width: '50%' },
    //         hAxis: {
    //           minValue: 0,
    //         },
    //         vAxis: {
    //           title: 'Total networth',
    //         },
    //       }}
    //       // For tests
    //       rootProps={{ 'data-testid': '1' }}
    //     />
    //   </div>
    // )
  }

  renderContent = () => {
    if (!this.props.orders) return (<div className='text-center'> <BeatLoader loading={true} color='#4b93ff' size={12} /> </div>);

    if (this.state.chart) {
      //render charts
      return <>{this.generateCharts()}</>;
    }

    //render Reports table
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'></th>
              <th scope='col'>Item</th>
              <th scope='col'>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.generateReportsRows()}
          </tbody>
        </table>
      </div>
    )
  }

  handleRangeChange = (o, date) => {
    if (o === 'from') return this.setState({fromRange: date, dateChanged: true});

    if (o === 'to' && date === null) return this.setState({toRange: null, dateChanged: true})

    let toDate = date;
    toDate.setMonth(toDate.getMonth() + 1);
    toDate.setDate(toDate.getDate() - 1);
    return this.setState({toRange: toDate, dateChanged: true});
  }

  render() {
    return (
      <div className='container users-main position-relative'>
        <h4>Reports</h4>
        <form onSubmit={e => e.preventDefault()} className='d-flex justify-content-start my-3'>
          <div className="form-check mx-3">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="reportsRadio" onChange={e => this.state.chart && this.setState({chart: false})} checked={!this.state.chart} />
            <label className="form-check-label" htmlFor="reportsRadio">
              Reports
            </label>
          </div>
          <div className="form-check mx-3 me-5">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="chartsRadio" onChange={e => !this.state.chart && this.setState({chart: true})} checked={this.state.chart} />
            <label className="form-check-label" htmlFor="chartsRadio">
              Charts
            </label>
          </div>
          <div className='input-group mx-2 w-unset'>
            <DatePicker
              dateFormat="MMM yyyy"
              selected={this.state.fromRange || null}
              onChange={this.handleRangeChange.bind(this, 'from')}
              placeholderText='From date'
              className='form-control border-0 border-bottom rounded-0'
              showMonthYearPicker={true}
            />
            <button className="btn" type="button" onClick={this.handleRangeChange.bind(this, 'from', null)}><i className='bi bi-x fs-5'></i></button>
          </div>
          <div className='input-group mx-2 w-unset'>
            <DatePicker
              dateFormat="MMM yyyy"
              selected={this.state.toRange || null}
              onChange={this.handleRangeChange.bind(this, 'to')}
              minDate={this.state.fromRange}
              placeholderText='To date'
              className='form-control border-0 border-bottom rounded-0'
              showMonthYearPicker={true}
            />
            <button className="btn" type="button" onClick={this.handleRangeChange.bind(this, 'to', null)}><i className='bi bi-x fs-5'></i></button>
          </div>
        </form>
        {this.renderContent()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    orders: state.orders.orders,
    costs: state.costs.costs,
    ordersCalled: state.orders.getCalled,
    costsCalled: state.costs.getCalled
  }
}

export default connect(
  mapStateToProps,
  {
    checkSignIn,
    getCosts
  }
)(Reports);
