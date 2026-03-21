import styles from './page.module.css'

export default function Index() {
  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Weivo Web</p>
        <h1 className={styles.title}>Fullstack workspace initialized.</h1>
        <p className={styles.copy}>
          Next.js now lives in `apps/web`, Expo in `apps/mobile`, and NestJS in `apps/api`.
        </p>
        <div className={styles.grid}>
          <article className={styles.card}>
            <span>Mobile</span>
            <strong>Expo Router app moved into the monorepo</strong>
          </article>
          <article className={styles.card}>
            <span>API</span>
            <strong>NestJS bootstrap ready for auth and domain modules</strong>
          </article>
          <article className={styles.card}>
            <span>Shared</span>
            <strong>Contracts package is ready for shared DTOs and response types</strong>
          </article>
        </div>
      </div>
    </main>
  )
}
