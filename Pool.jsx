import React from 'react';
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { EthContext } from '../contexts/EthContext/EthContext';
import { UserContext } from '../contexts/UserContext/UserContext';
import { PoolContext } from '../contexts/PoolContext/PoolContext';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import { FaGetPocket, FaCoins, FaCertificate } from "react-icons/fa";

import { hashString } from 'react-hash-string'

import poolpng from "../images/pool.png"

function Pool() {
    const { state: { web3, contract } } = useContext(EthContext);
    const { lendingEntries, borrowingEntries, updateEntries } = useContext(PoolContext);
    const { user } = useContext(UserContext);
    const [ethValue, setEthValue] = useState("0");
    const [contractBalance, setContractBalance] = useState("");    

    const handleEthChange = e => {
        setEthValue(e.target.value);
    };

    useEffect(() => {
        async function update() {
            await updateEntries(contract, user.user.accountAddress);
            await getBalance();
        }
        console.log("useEffect", contract, user);

        if(web3 && contract && user && user.user && user.user.accountAddress) {
            update();
        }
    },
    [JSON.stringify(lendingEntries), JSON.stringify(borrowingEntries), contractBalance, user]);
    
    function get_sample_age() {
        let ages = [...Array(20).keys()].map(i => i+25);
        const idx = Math.floor(Math.random() * ages.length)
        return ages[idx];
    }

    function get_sample_gender() {
        let genders = ["Male", "Female"];
        const idx = Math.floor(Math.random() * genders.length)
        return genders[idx];
    }

    function get_sample_category() {
        let categories = ["Food & Shelter", "Clothing", "Education", "Supplies"];
        const idx = Math.floor(Math.random() * categories.length)
        return categories[idx];
    }

    function get_sample_location() {
        let locations = ["Boulder", "Denver", "San Francisco", "San Jose", "New York City", "Dallas", "Austin", "Chicago", "Washington"];
        const idx = Math.floor(Math.random() * locations.length)
        return locations[idx];
    }

    function get_sample_time() {
        const month = Math.floor(Math.random() * 11);
        const day = Math.floor(Math.random() * 27);
        return new Date(2022, month, day+1).getTime();
    }

    function get_sample_eth_value() {
        const value = Math.random() * 0.0019 + 0.00001;
        return value;
    }

    const lend = async () => {
        // simulate lend

        let privateKey = "<>";
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const gasPrice = await web3.eth.getGasPrice();
        const contractAddress = contract._address;

        for (let i=0; i< 10; i++) {

            let currentTxNonce = txCount + (i+1);

            const txCount = await web3.eth.getTransactionCount(user.user.accountAddress);

            let sample_timestamp = get_sample_time();
            let sample_category = get_sample_category();
            let sample_location = get_sample_location();
            let sample_age = get_sample_age();
            let sample_gender = get_sample_gender();
            let sample_eth_value = get_sample_eth_value();

            const functionAbi = contract.methods.lend(sample_timestamp, sample_category, sample_age, sample_gender, sample_location).encodeABI();
            
            const txObject = {
                from: user.user.accountAddress,
                to: contractAddress,
                nonce: web3.utils.toHex(currentTxNonce),
                data: functionAbi,
                value: web3.utils.toWei(sample_eth_value.toFixed(4), "ether"),
                gasPrice: (parseInt(gasPrice) + 3*(i+1) + 1000).toString(),
                gasLimit: 300000
            };

            const signedTx = await account.signTransaction(txObject);

            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(receipt);
            console.log("Iteration: " + i);
        }


        // console.log("lend", contract, user);
        const currentTimeStamp = Date.now();
        // let response = await contract.methods.lend(currentTimeStamp).send({ from: user.user.accountAddress, value: web3.utils.toWei(ethValue, "ether") });
        // // await updateEntries(contract, user.user.accountAddress);
        // console.log(response)

        // create hash of the object
        const pool = 'Default Pool';
        const lendingHash = hashString(pool + user.user.accountAddress + ethValue + currentTimeStamp);
        // generate lending certificate
        // make POST call

        // await fetch('http://localhost:5000/api/generateCert', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         pool: 'Default Pool',
        //         fromAddress: user.user.accountAddress,
        //         value: ethValue,
        //         timestamp: currentTimeStamp,
        //         lendingHash: lendingHash
        //     })
        // })
    };

    const borrow = async () => {
        let privateKey = "<>";
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        let gasPrice = await web3.eth.getGasPrice();
        const contractAddress = contract._address;

        const txCount = await web3.eth.getTransactionCount(user.user.accountAddress);

        for (let i=0; i< 10; i++) {

            let currentTxNonce = txCount + (i+1);
            let txnGasPrice = parseInt(gasPrice + 100*(i+5));
            console.log('Current txn gas price : ' + txnGasPrice);

            let sample_timestamp = get_sample_time();
            let sample_category = get_sample_category();
            let sample_location = get_sample_location();
            let sample_age = get_sample_age();
            let sample_gender = get_sample_gender();
            let sample_eth_value = get_sample_eth_value();

            const functionAbi = contract.methods.borrow(web3.utils.toWei(sample_eth_value.toFixed(4), "ether"), sample_timestamp, sample_category, sample_age, sample_gender, sample_location).encodeABI();
            
            const txObject = {
                from: user.user.accountAddress,
                to: contractAddress,
                nonce: web3.utils.toHex(currentTxNonce + 5),
                data: functionAbi,
                gasPrice: (txnGasPrice).toString(),
                gasLimit: 300000
            };

            const signedTx = await account.signTransaction(txObject);

            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(receipt);
            console.log("Iteration: " + i);
        }
        // await contract.methods.borrow(web3.utils.toWei(ethValue, "ether"), Date.now()).send({ from: user.user.accountAddress });
        // await updateEntries(contract, user.user.accountAddress);
    };

    const getBalance = async () => {
        const balance = await contract.methods.getContractBalance().call({ from: user.user.accountAddress });
        setContractBalance(web3.utils.fromWei(balance, 'ether'));
    };

    return (
        <>
            <Container className="mt-2">
                <Row className="mt-2">
                    <Col/>
                    <Col xs={10} md={10} lg={10}>
                        <Card className="text-center">
                            <Card.Header>Lend and Borrow Crypto</Card.Header>
                            <Card.Body>
                                <Card.Title>Lending Pool</Card.Title>
                                <img height={90} width={90} src={poolpng} alt=""/><br/>

                                <Card.Text className="blockquote">
                                    Pool balance: {contractBalance} ETH
                                </Card.Text>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formAmount">
                                        <Form.Label>Amount (in ETH)</Form.Label>
                                        <Form.Control onChange={handleEthChange} type="text" placeholder="Enter amount in ETH" />
                                    </Form.Group>

                                    <ButtonToolbar className='justify-content-center'>
                                        <ButtonGroup className="me-2">
                                            <Button onClick={lend} variant="primary" type="submit">
                                                Lend
                                            </Button>
                                        </ButtonGroup>

                                        <ButtonGroup className="me-2">
                                            <Button onClick={borrow} variant="primary" type="submit">
                                                Borrow
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                    
                                </Form>
                            </Card.Body>
                            <Card.Footer className="text-muted">Powered by Ganache</Card.Footer>
                        </Card>
                    </Col>
                    <Col/>
                </Row>
                
                <Row className="mt-2">
                    <Col/>
                        <Col xs={10} md={10} lg={10}>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Transactions Lent</Accordion.Header>
                                    <Accordion.Body>
                                        <Table responsive striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Amount</th>
                                                    <th>Balance</th>
                                                    <th>Transaction Timestamp</th>
                                                    <th>Active</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <LendingEntryList entries={lendingEntries} updateEntries={updateEntries} web3={web3} />
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    <Col/>
                </Row>
                
                <Row className="mt-2">
                    <Col/>
                        <Col xs={10} md={10} lg={10}>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Transactions Borrowed</Accordion.Header>
                                    <Accordion.Body>
                                        <Table responsive striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Amount</th>
                                                    <th>Balance</th>
                                                    <th>Transaction Timestamp</th>
                                                    <th>Active</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <BorrowingEntryList entries={borrowingEntries} updateEntries={updateEntries} web3={web3} />
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    <Col/>
                </Row>
            </Container>
        </>
    );
}

function LendingEntry({ index, entry, web3 }) {
    const { state: { contract } } = useContext(EthContext);
    const { user } = useContext(UserContext);
    const [lenderBalance, setLenderBalance] = useState(0);
    const { updateEntries } = useContext(PoolContext);

    const getLenderBalance = async () => {
        console.log(index, user.user.accountAddress, contract);
        const balance = await contract.methods.getLenderBalance(index, Date.now()).call({ from: user.user.accountAddress });
        console.log(balance);
        setLenderBalance(balance);
    }

    useEffect(() => { async function getBalance(index) {
        await getLenderBalance(index, Date.now());
    }
    getBalance(index);
}, [index]);

    const withdraw = async () => {
        await contract.methods.withdraw(index, Date.now()).send({ from: user.user.accountAddress });
        await updateEntries(contract, user.user.accountAddress);
    }

    const viewCertificate = async (lendingEntry) => {
        const pool = 'Default Pool';
        
        const lendingHash = hashString(pool + user.user.accountAddress + web3.utils.fromWei(lendingEntry.amount, 'ether') + lendingEntry.timeStamp);

        window.open('http://localhost:5000/api/viewCert?id=' + lendingHash, "_blank");
    }

    return (
        <>
            <tr key = {index}>
                <td > { index + 1 } </td>
                <td> { web3.utils.fromWei(entry.amount, 'ether') } ETH </td>
                <td>
                    { web3.utils.fromWei(lenderBalance.toString(), 'ether') }
                    { entry.isActive &&
                        <span onClick={getLenderBalance} className='m-1'>
                            <FaGetPocket title="Refresh Balance"/>
                        </span> }
                </td>
                <td> { new Date(entry.timeStamp * 1000).toGMTString() } </td>
                <td> { entry.isActive ? "Yes" : "No" } </td>
                { entry.isActive && <td>
                    <Button className="mx-4" onClick={withdraw} variant="success">
                        <span className='m-1'>
                            <FaCoins title="Withdraw"/>
                        </span>
                        Withdraw
                    </Button>

                    <Button onClick={() => viewCertificate(entry)} variant="secondary">
                        <span className='m-1'>
                            <FaCertificate title="Download Certificate"/>
                        </span>
                        Certificate
                    </Button>
                </td> }
            </tr>
        </>
        
    );
}

function LendingEntryList({ entries, web3 }) {
    const items =  entries.map((entry, index) =>
        <LendingEntry key={index} index={index} entry={entry} web3={web3} />
    );

    return items;
}

function BorrowingEntry({ index, entry, web3 }) {
    const { state: { contract } } = useContext(EthContext);
    const { user } = useContext(UserContext);
    const [borrowerBalance, setBorrowerBalance] = useState(0);
    const { updateEntries } = useContext(PoolContext);

    const getBorrowerBalance = async () => {
        const balance = await contract.methods.getBorrowerBalance(index, Date.now()).call({ from: user.user.accountAddress });
        setBorrowerBalance(balance);
    }

    useEffect(() => { async function getBalance() {
            await getBorrowerBalance();
        }
        getBalance();
    }, [index]);

    const payback = async () => {
        const borrowerBalance = await contract.methods.getBorrowerBalance(index, Date.now()).call({ from: user.user.accountAddress });
        console.log((Number(borrowerBalance)).toString());
        await contract.methods.payback(index, Date.now()).send({ from: user.user.accountAddress, value: (Number(borrowerBalance)).toString() });
        await updateEntries(contract, user.user.accountAddress);
    }

    return (
        <>
            <tr key = {index}>
                <td > { index + 1 } </td>
                <td> { web3.utils.fromWei(entry.amount, 'ether') } ETH </td>
                <td>
                    { web3.utils.fromWei(borrowerBalance.toString(), 'ether') }
                    { entry.isActive && 
                        <span onClick={getBorrowerBalance} className='m-1'>
                            <FaGetPocket title="Refresh Balance"/>
                        </span> }
                </td>
                <td> { new Date(entry.timeStamp * 1000).toGMTString() } </td>
                <td> { entry.isActive ? "Yes" : "No" } </td>
                { entry.isActive  && <td>
                    <Button className="mx-4" onClick={payback} variant="success">
                        <span className='m-1'>
                            <FaCoins title="Payback"/>
                        </span>
                        Payback
                    </Button>
                </td> }
            </tr>
        </>
    );
}

function BorrowingEntryList({ entries, web3 }) {
    const items =  entries.map((entry, index) =>
        <BorrowingEntry key={index} index={index} entry={entry} web3={web3} />
    );

    return items;
}

export default Pool;