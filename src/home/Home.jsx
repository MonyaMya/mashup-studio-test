import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Modal, Button, Carousel } from 'react-bootstrap';
import album from '../_components/Images';
import thumbnail from './thumbnail.jpg';



import { accountService } from '_services';

function Home() {
    const [mounted, setMounted] = useState(false);
    const [accounts, setAccounts] = useState(null);
    const [show, setShow] = useState(false);
    useEffect(() => {
        setMounted(true);
        accountService.getAll().then(x => setAccounts(x));

        return () => setMounted(false);
    }, []);

    function deleteAccount(id) {
        // set isDeleting flag to show spinner
        setAccounts(accounts.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));

        // delete account
        accountService.delete(id).then(() => {
            if (mounted) {
                setAccounts(accounts.filter(x => x.id !== id));
            }
        });
    }

    return (
        <div>
            <h2>You're logged in with React & Facebook!!</h2>
            <p>All accounts from secure api end point:</p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Facebook Id</th>
                        <th>Name</th>
                        <th>Extra Info</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {accounts && accounts.map(account =>
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.facebookId}</td>
                            <td>{account.name}</td>
                            <td>{account.extraInfo}</td>
                            <td className="text-right" style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${account.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteAccount(account.id)} className="btn btn-sm btn-danger btn-delete-account" disabled={account.isDeleting}>
                                    {account.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!accounts &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            <h1 style={{ paddingTop: '20px', paddingBottom: '10px'}}>Your albums</h1>

            <Button onClick={accountService.getAlbums} variant="primary" style={{ width: '100px', height: '100px', padding: "0", margin: '5px', backgroundColor: 'grey', borderColor: 'transparent', fontSize: '11pt'}}>
                Upload new album 
            </Button>

            <Button variant="primary" style={{ width: '100px', height: '100px', padding: "0", margin: '5px', backgroundColor: 'transparent', borderColor: 'transparent'}} onClick={() => setShow(true)}>
                <Image src={thumbnail} style={{ width: '100px', height: '100px', borderRadius: '4px'}} alt='album thumbnail' /> 
            </Button>


                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Your Album
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel fade>
                            {album.map((img, index) => ( 

                                <Carousel.Item>
                                <Image key={index} src={img} alt='carousel image' style={{ width: '460px', height: '80vh', margin: '5px', borderRadius: '4px' }}/>                        
                                <Carousel.Caption>
                                    <h3>Enjoy Your Moments</h3>
                                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                </Carousel.Caption>
                                </Carousel.Item>

                            ))}
                        </Carousel>
                    </Modal.Body>
                </Modal>

        </div>
    );
}

export { Home };