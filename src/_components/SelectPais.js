import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'

import PaisesJSON from '../_helper/paises.json'

export default ({ form, setPaisCallback }) => {
  const [paises, setPaises] = useState([])

  //Creo las opciones del select de los paises al cargar el component
  useEffect(() => {
    setPaises(
      PaisesJSON.map((pais) => (
        <Select.Option key={pais.code} value={pais.code}>
          {pais.name}
        </Select.Option>
      )),
    )
  }, [])

  //Función para que al escribir en el select del país lo encuentre entre las opciones
  const onSearchPais = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
  }

  //Función para comprobar que el páis es correcto
  const checkPais = (rule, value) => {
    if (!value || PaisesJSON.findIndex((pais) => pais.code === value) !== -1) {
      return Promise.resolve()
    } else {
      return Promise.reject('País erróneo')
    }
  }

  //Función para cambiar validaciones según el páis
  const paisChange = (value) => {
    setPaisCallback(value)
  }

  const validationRules = [
    { required: true, message: 'Por favor seleccione un país.' },
    { validator: checkPais, message: 'Seleccione un país válido.' },
  ]

  return (
    <Form.Item label="País" name="pais" rules={validationRules}>
      <Select showSearch filterOption={onSearchPais} onChange={paisChange}>
        {paises}
      </Select>
    </Form.Item>
  )
}
