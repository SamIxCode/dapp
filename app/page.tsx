"use client"
import React, { useState, useEffect } from 'react'
import { CONTRACT_ADDRESS } from "./contacts";
import { ABI } from "./contacts";
import { ethers } from "ethers";



declare global {
  interface Window {
    ethereum?: any
  }
}


const page = () => {

  const [walletConnected, setWalletConnected] = useState(false)
  const [deadLine, setDeadLine] = useState(0)
  const [treshold, setTreshHold] = useState<number>(0)
  const [staked, setStaked] = useState<number>(0)
  const [userBalance, setUserBalance] = useState(0)
  const [totalbalance, setTotalBalance] = useState(0)
  const [count, setCount] = useState(0)
  const [signer, setSigner] = useState("")

  const incrementCount = () => {
    setCount(count + 1)
  }

  const getTreshold = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    const treshold = await contract.threshold()
    let tresholdFormated = ethers.formatEther(treshold)
    setTreshHold(Number(tresholdFormated))
    console.log("treshold :", tresholdFormated)
  }

  const gettotalBalance = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    const balance = await contract.totalBalance()
    setStaked(Number(ethers.formatEther(balance)))

    console.log("totalBalance :", staked)
    incrementCount()
  }

  const withdraw = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
    const withdraw = await contract.withdraw()



    incrementCount()
  }

  const getuserBalance = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    const balance = await contract.userBalance()
    setUserBalance(Number(ethers.formatEther(balance)))

    console.log("userBalance :", staked)
    incrementCount()
  }


  const execute = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)


    const tx = await contract.execute()
    console.log("executed , tx: ", tx)
    const recipt = await tx.wait()
    console.log("receipt: ", recipt)
    incrementCount()
  }



  const stake = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

    const tx = await contract.stake({
      value: ethers.parseEther("0.2"),
    })
  }

  useEffect(() => { }, [count])

  const connectWallet = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {

      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed,
      // so they only have read-only access
      console.log("MetaMask not installed; using read-only defaults")
      provider = ethers.getDefaultProvider("localhost")

    } else {

      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum)

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();

    }


  }

  return (
    <div className=' bg-slate-800 h-screen'>
      <div className=' flex justify-center pt-5'>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white" > StakeIt.</h1>


      </div>
      <div className=' content-center w-full flex justify-center'>
        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={connectWallet}
        > Connect wallet </button>
      </div>
      <div className=' content-center w-full flex justify-center'>
        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={getTreshold}
        > get Treshold </button>
      </div>
      <div className=' content-center w-full flex justify-center'>



        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={gettotalBalance}
        > get total Balance</button>

      </div>
      <div className=' content-center w-full flex justify-center'>



        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={getuserBalance}
        > get user Balance </button>

      </div>
      <div className=' content-center w-full flex justify-center'>



        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={execute}
        > execute </button>




      </div>
      <div className=' content-center w-full flex justify-center'>



        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={stake}
        > stake </button>

      </div>



      <div className=' content-center w-full flex justify-center'>



        <button className=' text-white bg-slate-600 rounded-lg  p-2'
          onClick={withdraw}
        > withdraw </button>

      </div>



    </div>
  )
}

export default page