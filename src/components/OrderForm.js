import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector, change, reset, initialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const get0Date = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);

class OrderForm extends Component {
  componentDidMount() {
    if (!this.props.data) {
      const today = get0Date(new Date());

      const counter = this.props.orders.filter(order => get0Date(new Date(order.submission_date)).toLocaleDateString() === today.toLocaleDateString()).length + 1;

      const orderNum = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${counter}`;

      return this.props.change('orderForm', 'order_num', orderNum)
    }

    let initData = {
      ...this.props.data,
      received_date_time: new Date(this.props.data.received_date_time),
      promised_date_time: new Date(this.props.data.promised_date_time),
      total_labore: this.props.data.labore_only,
      total_parts: this.props.data.parts_fee,
      total_tax: this.props.data.tax
    };
    let customerKeys = Object.keys(this.props.data.customer_info);
    let carKeys = Object.keys(this.props.data.car_info);

    carKeys.forEach(key => {
      initData[`car_${key}`] = this.props.data.car_info[key]
    });

    customerKeys.forEach(key => {
      initData[`customer_${key}`] = this.props.data.customer_info[key];

      if (key === 'second_auth') {
        initData['second_auth_name'] = this.props.data.customer_info.second_auth.name;
        initData['second_auth_phone'] = this.props.data.customer_info.second_auth.phone;
      }
    });

    this.props.initialize('orderForm', initData)
  }

  renderError = ({ error, touched }) => (touched && error) && <small className="form-text text-danger d-block">{error}</small>;

  renderInput = ({ input, label, meta, parentClass, inputClass, type }) => {
    return (
      <div className={`d-inline-block ${parentClass}`}>
        <input {...input} className={`form-control border-0 rounded-0 border-bottom ${inputClass}`} placeholder={label} type={type || 'text'} min={0}/>
        {this.renderError(meta)}
      </div>
    );
  }

  renderRadio = ({ input, label, parentClass, inputClass, radioValue, checked }) => {
    return (
      <div className={`form-check ${parentClass}`}>
        <input {...input} className={`form-check-input ${inputClass}`} type='radio' id={label.toLowerCase().replace(/ /g, '')} value={radioValue} checked={checked}/>
        <label className='form-check-label' htmlFor={label.toLowerCase().replace(/ /g, '')}>{label}</label>
      </div>
    );
  }

  renderCheckbox = ({ input, label, parentClass, inputClass, checkboxId, checked }) => {
    return (
      <input {...input} className={`form-check-input ${inputClass}`} type='checkbox' id={checkboxId} checked={checked} />
    );
  }

  renderTextField = ({ input, label, meta, parentClass, inputClass }) => {
    return (
      <div className={`d-inline-block ${parentClass}`}>
        <textarea {...input} className="form-control border-0 rounded-0 border-bottom" placeholder={label} rows="3"></textarea>
        {this.renderError(meta)}
      </div>
    );
  }

  renderDatePicker = ({ input, label, meta, parentClass, inputClass, minDate }) => {
    return (
      <div className={`d-inline-block ${parentClass}`}>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selected={input.value || null}
          onChange={input.onChange}
          minDate={minDate}
          disabledKeyboardNavigation
          placeholderText={label}
          className='form-control border-0 border-bottom rounded-0'
        />
        {this.renderError(meta)}
      </div>
    )
  }

  numberNormalizer = val => {
    let value = parseFloat(val.toString().replace(/,/g, '')).toString();

    if (isNaN(value)) return '';

    if (parseFloat(value) < 0) return 0;

    if (value.length <= 3) return value;

    let numRegex = /[0-9]*/;
    let res = '';
    let i;
    let tempRes;

    if (value.indexOf('.') >= 0) {
      res = value.slice(value.indexOf('.'), value.indexOf('.') + 3);
      value = value.slice(0, value.indexOf('.'));
    }

    if (value.length <= 3) return `${value}${res}`;

    if (value.length % 3 > 0) {
      tempRes = value.slice(0, value.length % 3);
      value = value.slice(value.length % 3);
    } else {
      tempRes = value.slice(0, 3);
      value = value.slice(3);
    }

    let forCounter = parseInt(value.length / 3)

    for (i = 0; i < forCounter; i++) {
      console.log(parseInt(value.length / 3));
      tempRes = `${tempRes},${value.slice(0, 3)}`;
      value = value.slice(3);
    }

    return `${tempRes}${res}`;
  }

  renderPartsTable = ({fields, meta }) => {
    if (fields.length < 2) fields.push();

    if (fields.length > 1 && fields.get(fields.length - 1)) fields.push();

    return fields.map((part, i) => (
      <tbody key={i}>
        <tr key={i}>
          <th scope="row">{i + 1}</th>
          <td>
            <Field
              name={`${part}.qty`}
              component={this.renderInput}
              label={'QTY.'}
              onBlur={this.partCal}
              normalize={value => this.numberNormalizer(value)}
            />
          </td>
          <td>
            <Field
              name={`${part}.num`}
              component={this.renderInput}
              label={'Part no.'}
            />
          </td>
          <td>
            <Field
              name={`${part}.name`}
              component={this.renderInput}
              label={'Part name'}
            />
          </td>
          <td>
            <Field
              name={`${part}.price`}
              component={this.renderInput}
              label={'Part price'}
              onBlur={this.partCal}
              normalize={value => this.numberNormalizer(value)}
            />
          </td>
          <td>
            <Field
              name={`${part}.price_total`}
              component={this.renderInput}
              label={'0'}
              inputClass='form-control-plaintext border-bottom-0 bg-transparent'
              onChange={(e) => e.preventDefault()}
            />
          </td>
          <td>
            <div className='form-check'>
              <Field
                name={`${part}.warranty`}
                component={this.renderCheckbox}
                checkboxId={`${part}.warranty`}
              />
            </div>
          </td>
        </tr>
        {this.renderError(meta)}
      </tbody>
    ))
  }

  renderLaboreTable = ({fields, meta }) => {
    if (fields.length < 2) fields.push();

    if (fields.length > 1 && fields.get(fields.length - 1)) fields.push();

    return fields.map((labore, i) => (
      <tbody key={i}>
        <tr key={i}>
          <th scope="row">{i + 1}</th>
          <td>
            <Field
              name={`${labore}.name`}
              component={this.renderInput}
              label={'Description'}
            />
          </td>
          <td>
            <Field
              name={`${labore}.price`}
              component={this.renderInput}
              label={'Price'}
              onBlur={this.laboreCal}
              normalize={value => this.numberNormalizer(value)}
            />
          </td>
        </tr>
        {this.renderError(meta)}
      </tbody>
    ))
  }

  renderWSText = radio => {
    if (!this.props.ws_choice) return null;

    if (this.props.ws_choice === 'requested' && radio === 'requested') return (
        <div className='card-text mt-1'>
          Requested - The bill should not exceed the estimate without written approval
        </div>
      )

    if (this.props.ws_choice === 'limited' && radio === 'limited') return (
        <div className='card-text mt-1'>
          Not requested - as long as the bill does not exceed $<Field
            name="written_estimate_limit"
            component={this.renderInput}
            label="0"
            parentClass="w-10"
            normalize={value => this.numberNormalizer(value)}
          />
        </div>
      )
  }

  renderWSChoice = () => {
    let checkedStats = {requested: false, limited: false, none: false}

    if (this.props.ws_choice) {
      checkedStats[this.props.ws_choice] = true;
    } else {
      checkedStats['none'] = true;
    }

    return (
      <>
        <Field
          name="written_estimate_choice"
          component={this.renderRadio}
          label="Requested"
          radioValue="requested"
          checked={checkedStats['requested']}
        />
        {this.renderWSText('requested')}
        <Field
          name="written_estimate_choice"
          component={this.renderRadio}
          label="Not requested - with limit"
          radioValue="limited"
          checked={checkedStats['limited']}
        />
        {this.renderWSText('limited')}
        <Field
          name="written_estimate_choice"
          component={this.renderRadio}
          label="Not requested"
          radioValue="none"
          checked={checkedStats['none']}
        />
      </>
    )
  }

  laboreCal = () => {
    let laboreAll = this.props.labore;
    let res = 0;

    if (!laboreAll || laboreAll.length === 0) return res;

    laboreAll.forEach(item => {
      if (!item) return;
      res += parseInt(item.price);
    });

    this.props.change('orderForm', 'total_labore', res);
    this.taxCal(res, 'labore');
  }

  partsCal = e => {
    let partsAll = this.props.parts;
    let res = 0;

    if (!partsAll || partsAll.length === 0) return res;

    partsAll.forEach(item => {
      if (!item) return;
      res += (parseInt(item.price || 0) * parseInt(item.qty || 1));
    });

    this.props.change('orderForm', 'total_parts', res);
    this.taxCal(res, 'parts');
  }

  partCal = e => {
    let rowIndex = e.target.name.match(/[0-9]+/)[0];
    let fieldName = e.target.name.match(/[a-zA-Z]+\[[0-9]+\]/)[0];
    let field = this.props.parts[rowIndex] || {};
    let qty = field.qty && field.qty !== '' ? field.qty : 1;
    let price = field.price && field.price !== '' ? field.price : 0;

    this.props.change('orderForm', `${fieldName}.price_total`, qty * price);
    this.partsCal();
  }

  taxCal = (val, field) => {
    let final = this.props.final;

    let parts = final.parts !== '' ? parseInt(final.parts) : 0;
    let labore = final.labore !== '' ? parseInt(final.labore) : 0;
    let gog = final.gog !== '' ? parseInt(final.gog) : 0;
    let misc = final.misc !== '' ? parseInt(final.misc) : 0;
    let sublet = final.sublet !== '' ? parseInt(final.sublet) : 0;
    let storage = final.storage !== '' ? parseInt(final.storage) : 0;

    if (field && field === 'parts') parts = val;
    if (field && field === 'labore') labore = val;

    let tax = ((parts + labore + gog + misc + sublet + storage) / 100) * 8.3;
    tax = Math.round(tax * 100) / 100;

    let total = parts + labore + gog + misc + sublet + storage + tax;

    this.props.change('orderForm', 'total_tax', tax);
    this.props.change('orderForm', 'total', total);
  }

  onCancel = () => {
    this.props.toggle();
    this.props.reset('orderForm');
  }

  onSubmit = formValues => {
    let data = formValues;

    data.parts = data.parts.filter(part => part);
    data.labore = data.labore.filter(lbr => lbr);
    data.state = 'california';
    // data.submission_date = this.props.data ? this.props.data.submission_date : new Date();
    // data.authorized_by = this.props.data ? this.props.data.authorized_by : 'Admin dude';
    data.authorized_by = 'admin dude';
    data.submission_date = new Date();

    this.props.onFormSubmit(data);
    this.props.toggle();
    this.props.reset('orderForm');
    //Take undefined values out of field arrays befor submit
    // this.props.onSubmit(formValues);
  }

  render () {

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)} autoComplete="off" className='order-form'>
        <div className='border rounded my-3'>
          <div className='card-header'>
            <div className='row'>
              <div className='col px-sm-3 px-0'>
                #<Field
                  name="order_num"
                  component={this.renderInput}
                  inputClass='form-control-plaintext border-bottom-0 bg-transparent'
                  parentClass='w-90'
                  onChange={(e) => e.preventDefault()}
                />
              </div>
              <div className='col px-sm-3 px-0 text-end'>
                <button className='btn text-success fs-4 p-0 mx-3' type='submit'><i className='bi bi-check-circle'></i></button>
                <button className='btn text-danger fs-4 p-0 mx-3' onClick={this.onCancel}><i className='bi bi-x-circle'></i></button>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='card-title'>
              <div className='row'>
                <div className='col-12 col-md-6'>
                  <div className='d-flex align-items-center'>
                    <i className="bi bi-person me-3"></i>
                    <Field
                      name="customer_name"
                      component={this.renderInput}
                      label="Customer name"
                    />
                  </div>
                  <div className='card-text mt-1 d-flex align-items-center'>
                    <i className="bi bi-telephone me-3"></i>
                    <Field
                      name="customer_phone"
                      component={this.renderInput}
                      label="Customer phone"
                    />
                  </div>
                </div>
                <div className='col-12 col-md-6'>
                  <div className='card-text mt-1 d-flex align-items-center'>
                    <span className='d-none d-md-inline'>Received at</span>
                    <Field
                      name="received_date_time"
                      component={this.renderDatePicker}
                      label="Received date"
                      parentClass='ms-2'
                      minDate={new Date()}
                    />
                  </div>
                  <div className='card-text mt-1 d-flex align-items-center'>
                    <span className='d-none d-md-inline'>Promised</span>
                    <Field
                      name="promised_date_time"
                      component={this.renderDatePicker}
                      label="Promised date"
                      parentClass='ms-2'
                      minDate={this.props.received_date}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12 col-md-6 border-end'>
                <div className='card-text mt-1 d-flex align-items-center'>
                  <i className="bi bi-house me-3"></i>
                  <Field
                    name="customer_address"
                    component={this.renderTextField}
                    label="Customer address"
                    parentClass='w-75'
                  />
                </div>
                <div className='card-text mt-3'>Second authorization</div>
                <div className='card-text mt-1 d-flex align-items-center'>
                  <i className="bi bi-person me-3"></i>
                  <Field
                    name="second_auth_name"
                    component={this.renderInput}
                    label="Name"
                  />
                </div>
                <div className='card-text mt-1 d-flex align-items-center'>
                  <i className="bi bi-telephone me-3"></i>
                  <Field
                    name="second_auth_phone"
                    component={this.renderInput}
                    label="Phone"
                  />
                </div>
              </div>
              <div className='col-12 col-md-6'>
                <div className='card-text mt-3'>Car info</div>
                <div className='row'>
                  <div className='col-12 col-lg-6 border-end'>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      Year <Field
                        name="car_year"
                        component={this.renderInput}
                        label="Year"
                        parentClass='ms-3'
                        normalize={value => this.numberNormalizer(value)}
                      />
                    </div>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      Vin#<Field
                        name="car_vin"
                        component={this.renderInput}
                        label="Vin"
                        parentClass='ms-3'
                      />
                    </div>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      Odometer#<Field
                        name="car_odometer"
                        component={this.renderInput}
                        label="Odometer"
                        parentClass='ms-3'
                      />
                    </div>
                  </div>
                  <div className='col-12 col-lg-6'>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      Make <Field
                        name="car_make"
                        component={this.renderInput}
                        label="Make"
                        parentClass='ms-3'
                        normalize={value => this.numberNormalizer(value)}
                      />
                    </div>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      License <Field
                        name="car_license"
                        component={this.renderInput}
                        label="License"
                        parentClass='ms-3'
                      />
                    </div>
                    <div className='card-text mt-1 d-flex align-items-center'>
                      motor#<Field
                        name="car_motor"
                        component={this.renderInput}
                        label="Motor"
                        parentClass='ms-3'
                      />
                    </div>
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
                  <th scope="col">Price $</th>
                  <th scope="col">Price total $</th>
                  <th scope="col">Warranty</th>
                </tr>
              </thead>
              <FieldArray name='parts' component={this.renderPartsTable} />
            </table>
            <div className='row'>
              <div className='col'>
                <div className='card-title fw-bold'>Labore</div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Description of service</th>
                      <th scope="col">Price $</th>
                    </tr>
                  </thead>
                  <FieldArray name='labore' component={this.renderLaboreTable} />
                </table>
                <div className='card-title fw-bold'>Terms</div>
                <div className='card-text mt-2'>Written estimate choice (for > $500 bill)</div>
                {this.renderWSChoice()}
                <div className='card-text mt-2'>
                  <div className='form-check'>
                    <Field
                      name='cost_profit_representation'
                      component={this.renderCheckbox}
                      checkboxId='cpRep'
                      checked={this.props.cp_rep}
                    />
                    <label className='form-check-label' htmlFor='cpRep'>
                      This charge represents costs and profits to the motor Vehicle repaire facility for miscellaneous shop suplies or waste disposal.
                    </label>
                  </div>
                </div>
                <div className='card-text mt-2'>
                  <div className='form-check'>
                    <Field
                      name='law_charge'
                      component={this.renderCheckbox}
                      checkboxId='lawCharge'
                      checked={this.props.law_charge}
                    />
                    <label className='form-check-label' htmlFor='lawCharge'>
                      This amount includes a charge of $<Field
                        name="law_charge_fee"
                        component={this.renderInput}
                        label="0"
                        parentClass='w-10'
                        inputClass='p-1'
                        normalize={value => this.numberNormalizer(value)}
                      /> required under California law.
                    </label>
                  </div>
                </div>
                <div className='card-text mt-2'>
                  <div className='form-check'>
                    <Field
                      name='return_replaced_parts'
                      component={this.renderCheckbox}
                      checkboxId='repReturn'
                      checked={this.props.part_return}
                    />
                    <label className='form-check-label' htmlFor='repReturn'>
                      Return replaced parts
                    </label>
                  </div>
                </div>
                <div className='card-text mt-2'>
                  Cancellation fee of $<Field
                    name='cancel_fee'
                    component={this.renderInput}
                    label='0'
                    parentClass='w-25'
                    normalize={value => this.numberNormalizer(value)}
                  />
                </div>
              </div>
              <div className='col'>
                <div className='card-title fw-bold'>Total</div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Description</th>
                      <th scope="col">Price $</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Labore only</td>
                      <td>
                        <Field
                          name="total_labore"
                          component={this.renderInput}
                          inputClass='form-control-plaintext border-bottom-0 bg-transparent'
                          onChange={(e) => e.preventDefault()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Parts</td>
                      <td>
                        <Field
                          name="total_parts"
                          component={this.renderInput}
                          inputClass='form-control-plaintext border-bottom-0 bg-transparent'
                          onChange={(e) => e.preventDefault()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Gas, oil & grease</td>
                      <td>
                        <Field
                          name="gas_oil_grease"
                          component={this.renderInput}
                          label="0"
                          onBlur={this.taxCal}
                          normalize={value => this.numberNormalizer(value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>Misc. mercendise</td>
                      <td>
                        <Field
                          name="misc_merch"
                          component={this.renderInput}
                          label="0"
                          onBlur={this.taxCal}
                          normalize={value => this.numberNormalizer(value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>Sublet repairs</td>
                      <td>
                        <Field
                          name="sublet_repairs"
                          component={this.renderInput}
                          label="0"
                          onBlur={this.taxCal}
                          normalize={value => this.numberNormalizer(value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">6</th>
                      <td>Storage fee</td>
                      <td>
                        <Field
                          name="storage_fee"
                          component={this.renderInput}
                          label="0"
                          onBlur={this.taxCal}
                          normalize={value => this.numberNormalizer(value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">7</th>
                      <td>Tax</td>
                      <td>
                        <Field
                          name="total_tax"
                          component={this.renderInput}
                          inputClass='form-control-plaintext border-bottom-0 bg-transparent'
                          onChange={(e) => e.preventDefault()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">8</th>
                      <th>Total</th>
                      <td>
                        <Field
                          name="total"
                          component={this.renderInput}
                          inputClass='form-control-plaintext border-bottom-0 bg-transparent'
                          onChange={(e) => e.preventDefault()}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <hr className='my-4' />
            <div className='card-text fw-bold d-inline-block mx-3'>Authorized by: {this.props.data ? this.props.data.authorized_by : 'Admin dude'}</div>
            <div className='card-text fw-bold d-inline-block mx-3'>Date: {this.props.data ? new Date(this.props.data.submission_date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
          <div className='card-footer text-end'>
            <button className='btn btn-secondary mx-2' onClick={this.onCancel}>Cancel</button>
            <button className='btn btn-success mx-2' type='submit'>Submit</button>
          </div>
        </div>
      </form>
    )
  }
}

const validate = formValues => {
  const errors = {};
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!formValues.customer_name) errors.customer_name = "Please enter customer's name";

  if (!formValues.customer_address) errors.customer_address = "Please enter customer's address";

  if (!formValues.customer_phone) errors.customer_phone = "Please enter customer's phone number";

  if (formValues.customer_phone && !phoneRegex.test(formValues.customer_phone)) errors.customer_phone = 'Invalid phone number';

  if (formValues.second_auth_phone && !phoneRegex.test(formValues.second_auth_phone)) errors.second_auth_phone = 'Invalid phone number';

  if (!formValues.received_date_time) errors.received_date_time = "Please enter received date";

  if (!formValues.promised_date_time) errors.promised_date_time = "Please enter promised date";

  return errors;
}

const selector = formValueSelector('orderForm')

const mapStateToProps = (state, ownProps) => {
  return {
    received_date: selector(state, 'received_date_time') || '',
    labore: selector(state, 'labore') || [],
    parts: selector(state, 'parts') || [],
    final: {
      parts: selector(state, 'total_parts') || 0,
      labore: selector(state, 'total_labore') || 0,
      gog: selector(state, 'gas_oil_grease') || 0,
      misc: selector(state, 'misc_merch') || 0,
      sublet: selector(state, 'sublet_repairs') || 0,
      storage: selector(state, 'storage_fee') || 0
    },
    ws_choice: selector(state, 'written_estimate_choice') || 'none',
    cp_rep: selector(state, 'cost_profit_representation') || false,
    law_charge: selector(state, 'law_charge') || false,
    part_return: selector(state, 'return_replaced_parts') || false,
    orders: state.orders.orders
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({change, reset, initialize}, dispatch);
}
// SelectingFormValuesForm = connect(state => {
//   // can select values individually
//   const hasEmailValue = selector(state, 'hasEmail')
//   const favoriteColorValue = selector(state, 'favoriteColor')
//   // or together as a group
//   const { firstName, lastName } = selector(state, 'firstName', 'lastName')
//   return {
//     hasEmailValue,
//     favoriteColorValue,
//     fullName: `${firstName || ''} ${lastName || ''}`
//   }
// })(SelectingFormValuesForm)

export default reduxForm({
  form: 'orderForm',
  validate
})(connect(mapStateToProps, mapDispatchToProps)(OrderForm))



//


// generateTermStatements = () => {
//   let results = [];
//
//   if (data.cost_profit_representation) results.push(`This charge represent costs and profits to the motor Vehicle repaire facility for miscellaneous shop suplies or waste disposal.`)
//
//   if (data.law_charge) results.push(`This amount includes a charge of $${data.law_charge_fee} which is required under ${data.state.charAt(0).toUpperCase() + data.state.slice(1)} law.`)
//
//   if (data.written_estimate_choice === 'none') results.push(`No written estimate requested`)
//
//   if (data.written_estimate_choice === 'full') results.push(`Full written estimate requested`)
//
//   if (data.written_estimate_choice.split(',')[0] === 'limited') results.push(`Written estimate not required within a limit of $${data.written_estimate_choice.split(',')[1]}`)
//
//   return results.map(term => <div className='card-text mt-3' key={data.id + '123'}><i className='bi bi-check2 me-2'></i>{term}</div>)
// }
