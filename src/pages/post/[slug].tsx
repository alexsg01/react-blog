import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns'
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Info from '../../components/Info';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO
  return (
    <main className={styles.container}>
      <img src={post.data.banner.url} alt={post.data.title} />
      <div className={styles.content}>
        <h1>{post.data.title}</h1>
        <div >
          <Info icon={FiCalendar} info={post.first_publication_date} />
          <Info icon={FiUser} info={post.data.author} />
          <Info icon={FiClock} info={`${post['time']} min`} />
        </div>
        {
          post.data.content.map(content => (
            <article key={content.heading}>
              <h2>{content.heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: content.body['text'] }} />
            </article>
          ))
        }

      </div>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  // TODO
  return {
    paths: [],
    fallback: 'blocking'

  }
};

export const getStaticProps: GetStaticProps = async context => {
  const prismicClient = getPrismicClient();
  const slug = context.params.slug.toString()

  const response = await prismicClient.getByUID('post', slug)

  const post: Post = {
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR
    }),
    data: {
      author: response.data.author,
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(ct => {
        return {
          heading: ct.heading,
          body: {
            text: RichText.asHtml(ct.body)
          }

        }
      }),
      title: response.data.title
    }
  }

  const time = response.data.content.reduce((sumTime, content) => {
    const titleWords = content.heading?.split(" ").length ?? 0
    const body = RichText.asText(content.body)
    const bodyWords = body.split(" ").length
    return sumTime + titleWords + bodyWords

  }, 0)

  post['time'] = Math.round(time / 200)

  // TODO
  return {
    props: {
      post
    }
  }
};
