import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .trim()
    .required()
    .oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
  toppings: yup
    .array()
    .ensure()
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [order, setOrder] = useState({
    fullName: "",
    size: "",
    toppings: []
  })
  const [errors, setErrors] = useState({
    fullName: "",
    size: "",
    toppings: ""
  })
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [enableSubmit, setEnableSubmit] = useState(false)

  useEffect(() => {
    schema.isValid(order).then(setEnableSubmit)
  }, [order])

  function onChange(evt) {
    let { name, value, checked, type, id } = evt.target
    if (type == "checkbox") {
      let checkboxes = order.toppings
      if (checkboxes.includes(id)) {
        checkboxes = checkboxes.filter((item) => item !== id)
      } else {
        checkboxes.push(id)
      }
      setOrder({ ...order, toppings: checkboxes})
    } else {
      setOrder({ ...order, [name]: value })
    }
    yup.reach(schema, name).validate(value)
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }))
  }

  function onSubmit(evt) {
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', order)
      .then(res => {
        setOrder({
          fullName: "",
          size: "",
          toppings: []
        })
        setSuccessMessage(res.data.message)
        setFailMessage()
      })
      .catch(err => {
        setFailMessage(err.response.data.message)
        setSuccessMessage()
      })
  }

  return (
    <form>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      {failMessage && <div className='failure'>{failMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" name="fullName" type="text" value={order.fullName} onChange={onChange}/>
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={order.size} onChange={onChange} id="size" name="size">
            <option key={1} value="">----Choose Size----</option>
            <option key={2} value="S">Small</option>
            <option key={3} value="M">Medium</option>
            <option key={4} value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping, idx) => (
          <label key={topping.topping_id}>
          <input
            // name={topping.text}
            type="checkbox"
            id={topping.topping_id}
            // id="toppings"
            name="toppings"
            // checked={order.toppings[idx]}
            onChange={onChange}
          />
          {topping.text}<br />
        </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!enableSubmit} type="submit" onClick={onSubmit}/>
    </form>
  )
}
