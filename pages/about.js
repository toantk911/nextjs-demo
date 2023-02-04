import axios from 'axios'
import { useIntl, useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import React, {useEffect} from 'react'
import Code from '../components/Code'
import PageLayout from '../components/PageLayout'

export default function About({merchants}) {
  console.log('>>> server axios', merchants)
  const t = useTranslations('About')
  const { locale } = useRouter()
  const intl = useIntl()
  const lastUpdated = new Date(2021, 0, 26, 17, 4, 45)

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("https://api.gogame.vn/wallets/payment-methods");
      console.log('>>> client axios', res.data);
    }
    fetch();
  }, [])

  return (
    <PageLayout title={t('title')}>
      <p>
        {t('description', {
          locale,
          code: (children) => <Code>{children}</Code>,
        })}
      </p>
      <p>
        {t('lastUpdated', {
          lastUpdated,
          lastUpdatedRelative: intl.formatRelativeTime(lastUpdated),
        })}
      </p>
    </PageLayout>
  )
}

export async function getStaticProps({ locale }) {
  const res = await fetch('https://api.gogame.vn/merchants/all')
  const merchants = await res.json()

  return {
    props: {
      messages: {
        ...require(`../messages/shared/${locale}.json`),
        ...require(`../messages/about/${locale}.json`),
      },
      now: new Date().getTime(),
      merchants
    },
  }
}
