import { Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'

export default ({ form, pais, persona }) => {
  const [tiposDocumentos, setTiposDocumentos] = useState([])

  //Cambio los tipos de documentos según el país y el tipo de persona
  useEffect(() => {
    let tiposDocumentos = []
    if (pais === 'ES') {
      if (persona === 'fisica') {
        tiposDocumentos = ['NIF']
      } else {
        tiposDocumentos = ['NIF', 'CIF']
      }
    } else if (pais) {
      tiposDocumentos = ['NIE', 'PASAPORTE']
    } else {
      tiposDocumentos = ['NIF', 'CIF', 'NIE', 'PASAPORTE']
    }

    setTiposDocumentos(tiposDocumentos)
  }, [pais, persona])

  const validarCIF = (cif) => {
    var par = 0
    var non = 0
    var letras = 'ABCDEFGHKLMNPQS'
    var letra = cif.charAt(0)

    if (cif.length !== 9) {
      return false
    }

    if (letras.indexOf(letra.toUpperCase()) === -1) {
      return false
    }
    let zz = 0
    for (zz = 2; zz < 8; zz += 2) {
      par = par + parseInt(cif.charAt(zz))
    }

    for (zz = 1; zz < 9; zz += 2) {
      var nn = 2 * parseInt(cif.charAt(zz))
      if (nn > 9) nn = 1 + (nn - 10)
      non = non + nn
    }

    var parcial = par + non
    var control = 10 - (parcial % 10)
    if (control === 10) control = 0

    if (control !== cif.charAt(8)) {
      return false
    }

    return true
  }

  const validarNIF = (nif) => {
    // Comprueba la longitud. Los DNI antiguos tienen 7 digitos.
    if (nif.length !== 8 && nif.length !== 9) return false
    if (nif.length === 8) nif = '0' + nif // Ponemos un 0 a la izquierda y solucionado

    // Comprueba el formato
    var regExp = new RegExp(/^[0-9]{8}[A-Z]$/)
    if (!nif.match(regExp)) return false

    var letraAux = nif.charAt(nif.length - 1)
    var dni = nif.substring(0, nif.length - 1)
    var letra = 'TRWAGMYFPDXBNJZSQVHLCKET'.charAt(dni % 23)
    return letra === letraAux.toUpperCase()
  }

  const validarNIE = (tr) => {
    if (tr.length !== 10 && tr.length !== 9) return false
    if (
      tr.charAt(0).toUpperCase() !== 'X' &&
      tr.charAt(0).toUpperCase() !== 'Y' &&
      tr.charAt(0).toUpperCase() !== 'Z'
    )
      return false

    var leftNum = '0'
    if (tr.charAt(0).toUpperCase() === 'Y') leftNum = '1'

    if (tr.length === 9) {
      return validarNIF(leftNum + tr.substring(1, tr.length))
    } else {
      return validarNIF(tr.substring(1, tr.length))
    }
  }

  //Funcion para validar el numero de documento
  const checkDocumento = (rule, value) => {
    let result = true
    const tipoDocumento = form.getFieldValue('tipoDocumento')
    switch (tipoDocumento) {
      case 'NIF':
        result = validarNIF(value)
        break
      case 'CIF':
        result = validarCIF(value)
        break
      case 'NIE':
        result = validarNIE(value)
        break
      //No valido los pasaportes porque no hay unas reglas universales para los formatos de pasaportes
      default:
        result = true
    }

    if (!value || result) {
      return Promise.resolve()
    } else {
      return Promise.reject(
        'Introduce un número de ' + tipoDocumento + ' válido',
      )
    }
  }

  //Funcion para validar el tipo de documento
  const checkTipoDocumento = (rule, value) => {
    if (
      !value ||
      tiposDocumentos.findIndex((tipoDocumento) => value === tipoDocumento) !==
        -1
    ) {
      return Promise.resolve()
    } else {
      return Promise.reject('Error en el tipo de documento')
    }
  }

  const validationsRules = {
    documento: [
      {
        required: true,
        message: 'Por favor introduzca su número de documento.',
      },
      { validator: checkDocumento },
    ],
    tipoDocumento: [
      { required: true, message: 'Por favor seleccione su tipo de documento' },
      { validator: checkTipoDocumento },
    ],
  }

  const prefixSelector = (
    <Form.Item
      name="tipoDocumento"
      noStyle
      rules={validationsRules.tipoDocumento}
      dependencies={['pais', 'persona']}
    >
      <Select placeholder="Tipo de documento">
        {tiposDocumentos.map((tipoDocumento) => (
          <Select.Option key={tipoDocumento} value={tipoDocumento}>
            {tipoDocumento}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )

  return (
    <Form.Item
      name="documento"
      label="Documento identificativo"
      rules={validationsRules.documento}
      dependencies={['tipoDocumento']}
    >
      <Input
        addonBefore={prefixSelector}
        style={{ width: '100%' }}
        placeholder="Nº del documento"
      />
    </Form.Item>
  )
}
