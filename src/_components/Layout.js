import Form from './Form'
import { Layout } from 'antd'
import React from 'react'

export default () => (
  <Layout className="layout">
    <Layout.Header>
      <h1> Prueba técnica Atrinium FrontEnd 1</h1>
    </Layout.Header>
    <Layout.Content className="site-layout-content">
      <div className="container">
        <Form />
      </div>
    </Layout.Content>
    <Layout.Footer style={{ textAlign: 'center' }}>
      Chema Ruano ©2020
    </Layout.Footer>
  </Layout>
)
