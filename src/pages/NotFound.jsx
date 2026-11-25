import { Link } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';
import GuideGirl from '../components/GuideGirl.jsx';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="nf">
      <div className="nf__girl"><GuideGirl /></div>
      <h1>404</h1>
      <p>{t.pages.notFound}</p>
      <Link to="/" className="btn btn--primary">{t.pages.toHome}</Link>
    </section>
  );
}
