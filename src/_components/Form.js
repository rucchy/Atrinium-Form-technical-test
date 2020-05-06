import { Button, Col, Form, Input, Radio, Row, notification } from 'antd'
import React, { useState } from 'react'

import DocIdentificativoInput from './DocIdentificativoInput'
import SelectPais from './SelectPais'

export default () => {
  const [form] = Form.useForm()

  const [persona, setPersona] = useState(false)
  const [pais, setPais] = useState(false)

  //Función para cambiar validaciones según el páis
  const paisChange = (value) => {
    setPais(value)
  }

  //Función para modificar el formulario según el tipo de persona
  const personaChange = (event) => {
    if (event === 'fisica' || event === 'juridica') {
      setPersona(event)
    } else {
      setPersona(false)
    }
  }

  //Funcion para comprobar que el codigo postal (en caso de seleccionar España) es correcto
  const checkCodigoPostal = (rule, value) => {
    if (form.getFieldValue('pais') === 'ES') {
      const regex = /^(?:0?[1-9]|[1-4]\d|5[0-2])\d{3}$/
      if (value !== '' && !regex.test(value)) {
        return Promise.reject('Codigo postal erróneo')
      }
    }
    return Promise.resolve()
  }

  //Función para resetear el formulario
  const onReset = () => {
    form.resetFields()
  }

  const onSubmit = () => {
    notification['success']({
      message: 'Formulario enviado correctamente!',
      description:
        'Tu información ha sido enviada correctamente. En breves nos pondremos en contacto contigo',
    })
    form.resetFields()
  }

  //Objeto con las validaciones de los campos del formulario
  const validationRules = {
    persona: [
      { required: true, message: 'Por favor seleccione un tipo de persona.' },
      {
        type: 'enum',
        enum: ['fisica', 'juridica'],
        message: 'Seleccione un tipo de persona válido',
      },
    ],
    nombre: [
      {
        required: true, //Como no se pinta si no se selecciona persona física se puede dejar como true para no hacer mas cálculos
        message: 'Por favor introduzca su nombre.',
      },
      { pattern: /^([^0-9]*)$/, message: 'Introduzca un nombre válido.' },
    ],
    apellidos: [
      {
        required: true, //Como no se pinta si no se selecciona persona física se puede dejar como true para no hacer mas cálculos
        message: 'Por favor introduzca sus apellidos.',
      },
      {
        pattern: /^([^0-9]*)$/,
        message: 'Introduzca unos apellidos válidos.',
      },
    ],
    nombreSociedad: [
      {
        required: true, //Como no se pinta si no se selecciona persona jurídica se puede dejar como true
        message: 'Por favor introduzca el nombre de su sociedad.',
      },
    ],
    direccion1: [
      {
        required: true,
        message: 'Por favor introduzca la primera parte de la dirección',
      },
    ],
    direccion2: [
      {
        required: true,
        message: 'Por favor introduzca la segunda parte de la dirección',
      },
    ],
    ciudad: [{ required: true, message: 'Por favor introduzca su ciudad' }],
    provincia: [
      {
        required: true,
        message: 'Por favor introduzca su Estado/Provincia/Región',
      },
    ],
    postal: [
      { required: true, message: 'Por favor introduzca su código postal' },
      {
        validator: checkCodigoPostal,
        message: 'Introduzca un código postal correcto',
      },
    ],
  }

  //Renderizo el formulario
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError
        onFinish={onSubmit}
      >
        <Row gutter="16">
          <Col md={8} xs={24}>
            <SelectPais form={form} setPaisCallback={paisChange} />
          </Col>
          <Col md={5} xs={24}>
            <Form.Item
              label="Tipo de persona"
              name="persona"
              rules={validationRules.persona}
            >
              <Radio.Group
                onChange={(e) => personaChange(e.target.value)}
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button
                  style={{ width: '100%', textAlign: 'center' }}
                  value="fisica"
                >
                  Física
                </Radio.Button>
                <Radio.Button
                  style={{ width: '100%', textAlign: 'center' }}
                  value="juridica"
                >
                  Jurídica
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col md={11} xs={24}>
            <DocIdentificativoInput form={form} pais={pais} persona={persona} />
          </Col>
        </Row>

        {persona && persona === 'fisica' && (
          <Row gutter="16">
            <Col md={11} xs={24}>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={validationRules.nombre}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={13} xs={24}>
              <Form.Item
                label="Apellidos"
                name="apellidos"
                rules={validationRules.apellidos}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}
        {persona && persona === 'juridica' && (
          <Row gutter="16">
            <Col span="24">
              <Form.Item
                label="Nombre de la sociedad"
                name="nombreSociedad"
                rules={validationRules.nombreSociedad}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter="16">
          <Col md={13} xs={24}>
            <Form.Item
              label="Línea 1 de la dirección"
              name="direccion1"
              rules={validationRules.direccion1}
            >
              <Input placeholder="Dirección postal, apartado de correos" />
            </Form.Item>
          </Col>
          <Col md={11} xs={24}>
            <Form.Item
              label="Línea 2 de la dirección"
              name="direccion2"
              rules={validationRules.direccion2}
            >
              <Input placeholder="Apartamento, suite, bloque, edificio, piso, etc." />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              label="Ciudad"
              name="ciudad"
              rules={validationRules.ciudad}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              label="Estado/Provincia/Región"
              name="provincia"
              rules={validationRules.provincia}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              label="Código postal"
              name="postal"
              rules={validationRules.postal}
              dependencies={['pais']}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter="16">
          <Col span="24">
            <Form.Item label="Datos extra" name="extra">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter="16">
          <Col span="24">
            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 16 }}
              >
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
