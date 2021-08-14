import React from 'react';
import { Link } from 'react-router-dom';

const Order = ({ data, actions = false, toggleEdit, toggleDelete }) => {
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

    if (data.written_estimate_choice === 'requested') results.push(`Written estimate requested. The final Bill may not Exceed this estimate without cusomer's written approval.`)

    if (data.written_estimate_choice === 'limited') results.push(`Written estimate not requested within a limit of $${data.written_estimate_limit}. The shop may not exeed this amount without customer's written or oral approval.`)

    results.push(`Customer ${!data.return_replaced_parts ? 'does not' : ''} desire the return of any of the Parts that are replaced during the authorized repairs.`);
    results.push(`Estimate is good for 30 days. This shop is not responsible for damage caused by theft, Fire, or acts of nature. I authorize the above repaires, along with any nececery materials. I autorize you and yor employees to operat my vehicle for the purpose of testing, and delivery at my risk. An express mechanic's lien is hereby acknowledge on the above vehicle to secure the amount of the repairs thereto. If I cancel repaires prior to thire completion for any reason, a tear-down and reassembly fee of $${data.cancel_fee || 0} will be applied.`)

    return results.map((term, i) => <div className='card-text mt-2' key={i}><i className='bi bi-check2 me-2'></i>{term}</div>)
  }

  const renderActions = () => {
    if (!actions) return null;

    return (
      <>
        <button className='btn text-danger fs-4 p-0 mx-2' onClick={toggleDelete}><i className='bi bi-trash'></i></button>
        <button className='btn text-success fs-4 p-0 mx-2' onClick={toggleEdit}><i className='bi bi-pencil-square'></i></button>
        <button className='btn text-primary fs-4 p-0 mx-2'><i className='bi bi-folder-symlink'></i></button>
      </>
    )
  }

  return (
    <Link to={`/order/${data.order_id}`} className='no-style-link'>
    <div className='card my-3'>
      <div className='card-header'>
        <div className='row'>
          <div className='col pt-2'>
            #{data.order_num}
          </div>
          <div className='col text-end'>
            {renderActions()}
          </div>
        </div>
      </div>
      <div className='card-body'>
        <div className='card-title'>
          <div className='row'>
            <div className='col-12 col-md-6'>
              <div className='card-text mt-1'><i className="bi bi-person me-3"></i>{data.customer_info.name}</div>
              <div className='card-text mt-1'><i className="bi bi-telephone me-3"></i>{data.customer_info.phone}</div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='card-text mt-1'>
                <span className='me-3'>Recieved at</span>
                {new Date(data.received_date_time).toLocaleDateString()}
              </div>
              <div className='card-text mt-1'>
                <span className='me-3'>Promised</span>
                {new Date(data.promised_date_time).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-6 border-end w-md-50'>
            <div className='card-text mt-1'><i className="bi bi-house me-3"></i>{data.customer_info.address}</div>
            <div className='card-text mt-3'>Second authorization</div>
            <div className='card-text mt-1'><i className="bi bi-person me-3"></i>{data.customer_info.second_auth.name}</div>
            <div className='card-text mt-1'><i className="bi bi-telephone me-3"></i>{data.customer_info.second_auth.phone}</div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='card-text mt-3'>Car info</div>
            <div className='row'>
              <div className='col border-end'>
                <div className='card-text mt-1'>Year: {data.car_info.year}</div>
              </div>
              <div className='col'>
                <div className='card-text mt-1'>Make: {data.car_info.make}</div>
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
        <div className='row'>
          <div className='col'>
            <div className='card-title fw-bold'>Labore</div>
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
            <div className='terms'>
              {generateTermStatements()}
            </div>
          </div>
          <div className='col'>
            <div className='card-title fw-bold'>Total</div>
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
                  <td>Gas, oil & grease</td>
                  <td>{data.gas_oil_grease}</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Misc. mercendise</td>
                  <td>{data.misc_merch}</td>
                </tr>
                <tr>
                  <th scope="row">5</th>
                  <td>Sublet repairs</td>
                  <td>{data.sublet_repairs}</td>
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
                  <th>{data.total_fee}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr className='my-4' />
        <div className='card-text fw-bold d-inline-block mx-3'>Authorized by: {data.authorized_by}</div>
        <div className='card-text fw-bold d-inline-block mx-3'>Date: {new Date(data.submission_date).toLocaleDateString()}</div>
      </div>
    </div>
    </Link>
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
