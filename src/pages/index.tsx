import { GetStaticProps } from 'next';
import * as prismic from '@prismicio/client'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi'


import styles from './home.module.scss';
import Info from '../components/Info';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  // TODO
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)

  function handleLoadMorePosts() {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data => {
        const newPosts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR
            }),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author
            }
          }
        })
        setPosts([...posts, ...newPosts]);
        setNextPage(data.next_page)
      })
  }

  return (
    <main className={styles.container}>
      {
        posts.map(post => (
          <div className={styles.content} key={post.uid}>
            <Link href={`/post/${post.uid}`} >
              <a>
                <h1>
                  {post.data.title}
                </h1>
              </a>
            </Link>
            <p>{post.data.subtitle}</p>
            <Info icon={FiCalendar} info={post.first_publication_date} />
            <Info icon={FiUser} info={post.data.author} />
          </div>
  ))
}
{
  nextPage ?
    <button type='button' onClick={handleLoadMorePosts}>
      Carregar mais posts
    </button>
    : null
}
    </main >
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const client = getPrismicClient();
  const postsResponse = await client.get({
    predicates: prismic.predicate.at('document.type', 'post'),
    pageSize: 2
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', {
        locale: ptBR
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })


  // TODO
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      }
    }
  }
};
