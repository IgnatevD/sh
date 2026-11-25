import { useI18n } from '../i18n.jsx';
import { useContent } from '../content.jsx';
import PageHero from '../components/PageHero.jsx';
import Gallery from '../components/Gallery.jsx';
import Stories from '../components/Stories.jsx';
import Contacts from '../components/Contacts.jsx';
import { About, Stats, Reviews, Manifesto } from '../components/Sections.jsx';

export function AboutPage() {
  const { t } = useI18n();
  const { content } = useContent();
  return (
    <>
      <PageHero title={t.pages.aboutTitle} lead={t.about.title} img={content.settings.photos.aboutHero} portrait={content.settings.photos.aboutPortrait} portraitCaption={`${t.about.sign} · UIMLA`} />
      <About />
      <Manifesto />
      <Stats />
      <Stories />
      <Reviews />
    </>
  );
}

export function GalleryPage() {
  const { t } = useI18n();
  const { content } = useContent();
  return (
    <>
      <PageHero title={t.pages.galleryTitle} lead={t.gallery.title} img={content.settings.photos.galleryHero || content.gallery[0]?.id} />
      <Stories />
      <Gallery limit={200} withHead={false} />
    </>
  );
}

export function ContactsPage() {
  const { t } = useI18n();
  const { content } = useContent();
  return (
    <>
      <PageHero title={t.pages.contactsTitle} lead={t.contacts.text} img={content.settings.photos.contactsHero} small />
      <Contacts />
    </>
  );
}
