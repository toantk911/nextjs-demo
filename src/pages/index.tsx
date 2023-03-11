import { useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [error, setError] = useState('Start with login')

  const handleLogin = async () => {
    try {
      setError('Please wait...')
      // Call API to login using axios
      const res = await axios.post('https://amz-demo-api.toan.tk/login', { username, password }, { timeout: 60000 })
      console.log(res)
      if (res.data == 'otp') {
        setError('Please type OTP')
      } else if (res.data == 'prompt') {
        setError('Please approve the notification on your mobile Amazon app them click "OTP" button')
      } else {
        setError(res.data)
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message)
    }
  }

  const handleOtp = async () => {
    try {
      setError('Please wait...')
      // Call API to login using axios
      const res = await axios.post('https://amz-demo-api.toan.tk/otp', { username, otp }, { timeout: 60000 })
      console.log(res)
      if (res.data == 'OK') {
        setError('Login success')
      } else {
        setError(res.data)
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message)
    }
  }

  const handleOrders = async () => {
    try {
      setError('Please wait...')
      // Call API to login using axios
      const res = await axios.get(`https://amz-demo-api.toan.tk/orders/${username}`, { timeout: 60000 })
      console.log(res)
      // check if res.data is an array
      if (Array.isArray(res.data)) {
        setOrders(res.data)
        setError('Scraped orders')
      } else {
        setError(res.data)
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      setError('Please wait...')
      // Call API to login using axios
      const res = await axios.get(`https://amz-demo-api.toan.tk/logout/${username}`, { timeout: 60000 })
      console.log(res)
      if (res.data == 'OK') {
        setError('Logout success')
      } else {
        setError(res.data)
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div className={styles.card}>
            <h2 className={inter.className}>
              Login <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Type your username and password to login. Your password will not be stored.
            </p>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <br />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button onClick={handleLogin}>Login</button>
          </div>

          <div className={styles.card}>
            <h2 className={inter.className}>
              Type OTP <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Type OTP on your authenticator app or on SMS sent to your phone. If you don&apos;t have OTP, click &quot;OTP&quot; button.
            </p>
            <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
            <br />
            <button onClick={handleOtp}>OTP</button>
          </div>

          <div className={styles.card}>
            <h2 className={inter.className}>
              Get orders <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              After successful login, you can get orders from your account. Currently, we only support orders from the first page.
            </p>
            <br />
            <button onClick={handleOrders}>Orders</button>
          </div>

          <div className={styles.card}>
            <h2 className={inter.className}>
              Logout <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Clear your cookies from server.
            </p>
            <br />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className={styles.center}>
          <p className={inter.className} style={{color: 'red'}}>{error}</p>
        </div>

        <div className={styles.grid} style={{gridTemplateColumns: "none"}}>
          <h2 className={inter.className}>{orders.length} orders</h2>
          {orders.map((order) => (
            <div key={order.orderId} className={styles.card}>
              <h3 className={inter.className}>Order # {order.orderId}</h3>
              <p className={inter.className}>Total: {order.price}</p>
              <p className={inter.className}>Order placed: {order.date}</p>
              
              {(order.items as any[]).map((item, index) => (
                <div key={`${order.orderId}-${index}`} className={styles.card}>
                  <p className={inter.className} style={{maxWidth: "none"}}>Item: {item.title}</p>
                  <p className={inter.className} style={{maxWidth: "none"}}>Link: {item.link}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
