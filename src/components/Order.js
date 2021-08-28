import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

import {
  numberNormalizer
} from '../helper'

const Order = ({ data, actions = false, toggleEdit, toggleDelete, share }) => {
  const [viewRaw, setViewRaw] = useState(false);
  const history = useHistory();

  const generatePartRows = rows => rows.map((row, i) => (
    <tr key={i}>
      <th scope="row">{i + 1}</th>
      <td>{numberNormalizer(row.qty)}</td>
      <td>{row.num}</td>
      <td>{row.name}</td>
      <td>{numberNormalizer(row.price)}</td>
      <td>{numberNormalizer(row.price_total)}</td>
      <td>{row.warranty ? 'Yes' : 'No'}</td>
    </tr>
  ))

  const generateLaboreRows = rows => rows.map((row, i) => (
    <tr key={i}>
      <th scope="row">{i + 1}</th>
      <td>{row.name}</td>
      <td>{numberNormalizer(row.price)}</td>
    </tr>
  ))

  const generateTermStatements = () => {
    let results = [];

    if (data.order.cost_profit_representation) results.push(`This charge represent costs and profits to the motor Vehicle repaire facility for miscellaneous shop suplies or waste disposal.`)

    if (data.order.law_charge) results.push(`This amount includes a charge of $${numberNormalizer(data.order.law_charge_fee)} which is required under ${data.order.state.charAt(0).toUpperCase() + data.order.state.slice(1)} law.`)

    if (data.order.written_estimate_choice === 'none') results.push(`No written estimate requested`)

    if (data.order.written_estimate_choice === 'requested') results.push(`Written estimate requested. The final Bill may not Exceed this estimate without cusomer's written approval.`)

    if (data.order.written_estimate_choice === 'limited') results.push(`Written estimate not requested within a limit of $${numberNormalizer(data.order.written_estimate_limit)}. The shop may not exeed this amount without customer's written or oral approval.`)

    results.push(`Customer ${!data.order.return_replaced_parts ? 'does not' : ''} desire the return of any of the Parts that are replaced during the authorized repairs.`);
    results.push(`Estimate is good for 30 days. This shop is not responsible for damage caused by theft, Fire, or acts of nature. I authorize the above repaires, along with any nececery materials. I autorize you and yor employees to operat my vehicle for the purpose of testing, and delivery at my risk. An express mechanic's lien is hereby acknowledge on the above vehicle to secure the amount of the repairs thereto. If I cancel repaires prior to thire completion for any reason, a tear-down and reassembly fee of $${numberNormalizer(data.order.cancel_fee) || 0} will be applied.`)

    return results.map((term, i) => <div className='card-text mt-2' key={i}><i className='bi bi-check2 me-2'></i>{term}</div>)
  }

  const renderActions = () => {
    if (!actions) return null;

    return (
      <>
        <button className='btn text-danger fs-4 p-0 mx-2' onClick={toggleDelete}><i className='bi bi-trash'></i></button>
        <button className='btn text-success fs-4 p-0 mx-2' onClick={toggleEdit}><i className='bi bi-pencil-square'></i></button>
        <a href={`http://51.75.182.106:4050/share/${data.order_id}`} target="_blank"><button className='btn text-primary fs-4 p-0 mx-2'><i className='bi bi-folder-symlink'></i></button></a>
      </>
    )
  }

  const renderHeader = () => (
    <div className='card-header'>
      <div className='row'>
        <div className='col pt-2'>
          #{data.order.order_num}
        </div>
        <div className='col text-end'>
          {renderActions()}
        </div>
      </div>
    </div>
  )

  const renderNormalContent = () => (
    <>
      <div className='card-title'>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <div className='card-text mt-1'><i className="bi bi-person me-3 text-muted"></i><span className='fst-italic'>{data.order.customer_info.name}</span></div>
            <div className='card-text mt-1'><i className="bi bi-telephone me-3 text-muted"></i><span className='fst-italic'>{data.order.customer_info.phone}</span></div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='card-text mt-1'>
              <span className='me-3 text-muted'>Recieved at:</span>
              <span className='fst-italic'>{new Date(data.order.received_date_time).toLocaleDateString()}</span>
            </div>
            <div className='card-text mt-1'>
              <span className='me-3 text-muted'>Promised:</span>
              <span className='fst-italic'>{new Date(data.order.promised_date_time).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-6 border-end w-md-50'>
          <div className='card-text mt-1'><i className="bi bi-house me-3 text-muted"></i><span className='fst-italic'>{data.order.customer_info.address}</span></div>
          <div className='card-text mt-3 text-muted'>Second authorization</div>
          <div className='card-text mt-1'><i className="bi bi-person me-3 text-muted"></i><span className='fst-italic'>{data.order.customer_info.second_auth.name}</span></div>
          <div className='card-text mt-1'><i className="bi bi-telephone me-3 text-muted"></i><span className='fst-italic'>{data.order.customer_info.second_auth.phone}</span></div>
        </div>
        <div className='col-12 col-md-6'>
          <div className='card-text mt-3 fw-bold'>Car info</div>
          <div className='row'>
            <div className='col border-end'>
              <div className='card-text mt-1'><span className='text-muted me-2'>Year:</span><span className='fst-italic'>{data.order.car_info.year}</span></div>
            </div>
            <div className='col'>
              <div className='card-text mt-1'><span className='text-muted me-2'>Make:</span><span className='fst-italic'>{data.order.car_info.make}</span></div>
            </div>
          </div>
          <div className='row'>
            <div className='col border-end'>
              <div className='card-text mt-1'><span className='text-muted'>Vin: #</span><span className='fst-italic'>{data.order.car_info.vin}</span></div>
            </div>
            <div className='col'>
              <div className='card-text mt-1'><span className='text-muted me-2'>License:</span><span className='fst-italic'>{data.order.car_info.license}</span></div>
            </div>
          </div>
          <div className='row'>
            <div className='col border-end'>
              <div className='card-text mt-1'><span className='text-muted'>Odometer: #</span><span className='fst-italic'>{data.order.car_info.odometer}</span></div>
            </div>
            <div className='col'>
              <div className='card-text mt-1'><span className='text-muted'>motor: #</span><span className='fst-italic'>{data.order.car_info.motor}</span></div>
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
            <th scope="col">Price total</th>
            <th scope="col">Warranty</th>
          </tr>
        </thead>
        <tbody>
          {generatePartRows(data.order.parts)}
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
              {generateLaboreRows(data.order.labore)}
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
                <td>{numberNormalizer(data.order.labore_only)}</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Parts</td>
                <td>{numberNormalizer(data.order.parts_fee)}</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Gas, oil & grease</td>
                <td>{numberNormalizer(data.order.gas_oil_grease)}</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Misc. mercendise</td>
                <td>{numberNormalizer(data.order.misc_merch)}</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Sublet repairs</td>
                <td>{numberNormalizer(data.order.sublet_repairs)}</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Storage fee</td>
                <td>{numberNormalizer(data.order.storage_fee)}</td>
              </tr>
              <tr>
                <th scope="row">7</th>
                <td>Tax</td>
                <td>{numberNormalizer(data.order.tax)}</td>
              </tr>
              <tr>
                <th scope="row">8</th>
                <th>Total</th>
                <th>{numberNormalizer(data.order.total_fee)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  const renderRawContent = () => (
    <>
      <div className='card-title fw-bold'>Parts</div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">QTY.</th>
            <th scope="col">Part no.</th>
            <th scope="col">Name of part</th>
            <th scope="col">Price</th>
            <th scope="col">Price total</th>
            <th scope="col">Warranty</th>
          </tr>
        </thead>
        <tbody>
          {generatePartRows(data.shopOrder.parts)}
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
              {generateLaboreRows(data.shopOrder.labore)}
            </tbody>
          </table>
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
                <td>{numberNormalizer(data.shopOrder.labore_only)}</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Parts</td>
                <td>{numberNormalizer(data.shopOrder.parts_fee)}</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Gas, oil & grease</td>
                <td>{numberNormalizer(data.shopOrder.gas_oil_grease)}</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Misc. mercendise</td>
                <td>{numberNormalizer(data.shopOrder.misc_merch)}</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Sublet repairs</td>
                <td>{numberNormalizer(data.shopOrder.sublet_repairs)}</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Storage fee</td>
                <td>{numberNormalizer(data.shopOrder.storage_fee)}</td>
              </tr>
              <tr>
                <th scope="row">7</th>
                <th>Total</th>
                <th>{numberNormalizer(data.shopOrder.total_fee)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  return (
    <>
      {actions &&
        <div className='d-flex justify-content-between '>
        <button type='button' className='btn btn-link' onClick={() => history.push('/')}><span className="me-2"><i className='bi bi-arrow-left'></i></span>Back to home</button>
          <button type='button' className='btn btn-link' onClick={() => setViewRaw(!viewRaw)}>Switch to {viewRaw ? 'normal view' : 'raw view'}<span className="ms-2"><i className='bi bi-arrow-left-right'></i></span></button>
        </div>
      }
      <div className={`card my-3 ${actions && 'no-hover'}`}>
        {(!actions && !share) &&
          <Link to={`/order/${data.order_id}`} className='no-style-link'>
            {renderHeader()}
          </Link>
        }
        {actions && renderHeader()}
        <div className='card-body'>
          {!viewRaw && renderNormalContent()}
          {viewRaw && renderRawContent()}
          <hr className='my-4' />
          <div className='card-text fw-bold d-inline-block mx-3'>Authorized by: {data.order.authorized_by}</div>
          <div className='card-text fw-bold d-inline-block mx-3'>Date: {new Date(data.order.submission_date).toLocaleDateString()}</div>
        </div>
      </div>
    </>
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
