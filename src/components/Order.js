import React, { Component } from 'react';

const Order = ({ data }) => {
  const generatePartRows = () => data.parts.map((row, i) => (
    <tr key={i}>
      <th scope="row">{i + 1}</th>
      <td>{row.qty}</td>
      <td>{row.num}</td>
      <td>{row.name}</td>
      <td>{row.price}</td>
      <td>{row.warranty ? 'Yes' : 'No'}</td>
    </tr>
  ))

  const generateLaboreRows = () => data.labore.map((row, i) => (
    <tr key={i}>
      <th scope="row">{i + 1}</th>
      <td>{row.name}</td>
      <td>{row.price}</td>
    </tr>
  ))

  const generateTermStatements = () => {
    let results = [];

    if (data.cost_profit_representation) results.push(`This charge represent costs and profits to the motor Vehicle repaire facility for miscellaneous shop suplies or waste disposal.`)

    if (data.law_charge) results.push(`This amount includes a charge of $${data.law_charge_fee} which is required under ${data.state.charAt(0).toUpperCase() + data.state.slice(1)} law.`)

    if (data.written_estimate_choice === 'none') results.push(`No written estimate requested`)

    if (data.written_estimate_choice === 'full') results.push(`Full written estimate requested`)

    if (data.written_estimate_choice.split(',')[0] === 'limited') results.push(`Written estimate not required within a limit of $${data.written_estimate_choice.split(',')[1]}`)

    return results.map(term => <div className='card-text mt-3' key={data.id + '123'}><i className='bi bi-check2 me-2'></i>{term}</div>)
  }

  return (
    <div className='card my-3'>
      <div className='card-header'>
        #{data.id}
      </div>
      <div className='card-body'>
        <div className='card-title'>
          <div className='row'>
            <div className='col'>
              <i className="bi bi-person me-3"></i>{data.customer_info.name}
            </div>
            <div className='col'>
              <div className='card-text mt-1'>Recieved at {data.received_date_time.toLocaleString()}</div>
              <div className='card-text mt-1'>Promised {data.promised_date_time.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col border-end'>
            <div className='card-text mt-1'><i className="bi bi-house me-3"></i>{data.customer_info.address}</div>
            <div className='card-text mt-1'><i className="bi bi-telephone me-3"></i>{data.customer_info.phone}</div>
            <div className='card-text mt-3'>Second authorization</div>
            <div className='card-text mt-1'><i className="bi bi-person me-3"></i>{data.customer_info.second_auth.name}</div>
            <div className='card-text mt-1'><i className="bi bi-telephone me-3"></i>{data.customer_info.second_auth.phone}</div>
          </div>
          <div className='col'>
            <div className='card-text mt-3'>Car info</div>
            <div className='row'>
              <div className='col border-end'>
                <div className='card-text mt-1'>Year: {data.car_info.year}</div>
              </div>
              <div className='col'>
                <div className='card-text mt-1'>Make: {data.car_info.year}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col border-end'>
                <div className='card-text mt-1'>Vin: #{data.car_info.vin}</div>
              </div>
              <div className='col'>
                <div className='card-text mt-1'>License: {data.car_info.license}</div>
              </div>
            </div>
            <div className='row'>
              <div className='col border-end'>
                <div className='card-text mt-1'>Odometer: #{data.car_info.odometer}</div>
              </div>
              <div className='col'>
                <div className='card-text mt-1'>motor: #{data.car_info.motor}</div>
              </div>
            </div>
          </div>
        </div>
        <hr className='mt-4' />
        <div className='card-title fw-bold'>Parts</div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">QTY.</th>
              <th scope="col">Part no.</th>
              <th scope="col">Name of part</th>
              <th scope="col">Price</th>
              <th scope="col">Warranty</th>
            </tr>
          </thead>
          <tbody>
            {generatePartRows()}
          </tbody>
        </table>
        <div className='card-title fw-bold mt-4'>Labore</div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Description of service</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {generateLaboreRows()}
          </tbody>
        </table>
        <hr className='my-4' />
        <div className='row'>
          <div className='col-7'>
            {generateTermStatements()}
          </div>
          <div className='col-5'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Labore only</td>
                  <td>{data.labore_only}</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Parts</td>
                  <td>{data.parts_fee}</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Gas, oil & greese</td>
                  <td>{data.gas_oil_greece}</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Misc. mercendise</td>
                  <td>{data.misc_merch}</td>
                </tr>
                <tr>
                  <th scope="row">5</th>
                  <td>Sublet repairs</td>
                  <td>{data.subtle_repairs}</td>
                </tr>
                <tr>
                  <th scope="row">6</th>
                  <td>Storage fee</td>
                  <td>{data.storage_fee}</td>
                </tr>
                <tr>
                  <th scope="row">7</th>
                  <td>Tax</td>
                  <td>{data.tax}</td>
                </tr>
                <tr>
                  <th scope="row">8</th>
                  <th>Total</th>
                  <th>{data.total}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='card-text fw-bold'>Authorized by: {data.authorized_by}</div>
      </div>
    </div>
  )
}

export default Order;





// import { connect } from 'react-redux';
//
// class Landing extends Component {
//
//   render() {
//     if (!this.props.orders) return <div>Loading...</div>;
//
//     // const { id } = this.props.orders.orders;
//
//     return(
//       <div>
//         <h3>hi</h3>
//         <h5 className='text-muted'>here</h5>
//       </div>
//     );
//   }
// }
//
// const mapStateToProps = (state, ownProps) => {
//   return {
//     orders: state.orders.orders
//   };
// }
//
// export default connect(mapStateToProps, {})(Landing);
