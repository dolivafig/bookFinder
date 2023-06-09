import React, { useState } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  // const userDataLength = Object.keys(userData).length;
  // const bookCount = data.me.bookCount;
  // console.log(bookCount);
  const  {error, data: {me:data} ={} }  = useQuery(GET_ME);
  console.log({data});
  console.log(Object.keys(userData));
  console.log('userData '+ userData);
    // const getUserData = async () => {
    //   try {
    //     const token = Auth.loggedIn() ? Auth.getToken() : null;

    //     if (!token) {
    //       return false;
    //     }

    //     const response = await getMe(token);

    //     if (!response.ok) {
    //       throw new Error('something went wrong!');
    //     }

    //     const user = await response.json();
    //     setUserData(user);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    // getUserData();

  const [deleteBook] = useMutation(REMOVE_BOOK);
  // , {
  //     update(cache, {data: {deleteBook}}) {
  //       try{
  //         cache.writeQuery({
  //           query: GET_ME,
  //           data: {me: deleteBook},
  //         });
  //       } catch(e) {
  //         console.error(e);
  //       }
  //     },
  //   });

  const getUserData = async (data) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;
console.log(token);
      if (!token) {
        return false;
      }
      if (!data.ok) {
                throw new Error('something went wrong!');
              }
              const user = await data.json();
              setUserData(user);
            } catch (err) {
              console.error(err);
            }
          };
      
          getUserData(data);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook({ variables: {bookId: bookId }});

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!data) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.bookCount
            ? `Viewing ${data.bookCount} saved ${data.bookCount === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
