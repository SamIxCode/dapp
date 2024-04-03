"use client"
import React, { useState, useEffect } from 'react'
import { CONTRACT_ADDRESS } from "./constants";
import { ABI } from "./constants";
import { ethers } from "ethers";

import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Box, Text,StackDivider,Divider, HStack, Button} from '@chakra-ui/react'

declare global {
  interface Window {
    ethereum?: any
  }
}


const page = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const [staked, setStaked] = useState<number>(0)

  const [count, setCount] = useState(0)


  const incrementCount = () => {
    setCount(count + 1)
  }



  const getProjects = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
      const idsResult = await contract.getAllProjectIds();
      const ids = Object.values(idsResult).map(id => Number(id));
      console.log(ids);
      return ids;
    } catch (error) {
      console.error('Error retrieving project IDs:', error);
      return [];
    }
  };
  



  interface ProjectDetails {
    creator: string;
    name: string;
    description: string;
    socialLinks: string;
    deadline: any;
    goalAmount: any;
    raisedAmount: any;
  }
  
  const getProjectDetails = async (projectId: number): Promise<ProjectDetails | null> => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const project = await contract.projects(projectId);
      return {
        creator: project.creator,
        name: project.name,
        description: project.description,
        socialLinks: project.socialLinks,
        deadline: project.deadline,
        goalAmount: project.goalAmount,
        raisedAmount: project.raisedAmount
      };
    } catch (error) {
      console.error(`Error retrieving details for project ${projectId}:`, error);
      return null;
    }
  };
  
  const getAllProjectsDetails = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not installed; using read-only defaults");
        return [];
      }
  
      const ids = await getProjects();
      const projectDetailsPromises = ids.map(id => getProjectDetails(id));
      const projectDetails = await Promise.all(projectDetailsPromises);
      setProjects(projectDetails);
      console.log(projectDetails);
  
      return projectDetails;
    } catch (error) {
      console.error('Error retrieving all projects details:', error);
      return [];
    }
  };
  
  const fundProject = async () => {
    try {
      console.log("funding")
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const transaction = await contract.fundProject(4, {
        value: ethers.parseEther('1') // Amount to fund the project (in ETH)
      });

      await transaction.wait();
      console.log('Project funded successfully!');
    } catch (error) {
      console.error('Error funding project:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

      const tx = await contract.createProject('My Project', 'Description of My Project', 'https://twitter.com/myproject', 360, 1)
      await tx.wait()
      alert('Project created successfully!');

} catch (error) {
  console.error('Error creating project:', error);
}
    
  }




  useEffect(() => {
    getAllProjectsDetails();
  }, []);


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
    <div className="bg-slate-800 h-screen">
      <div className="flex justify-center pt-5">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          CrowdFund.
        </h1>
      </div>
      <div className="content-center w-full flex justify-center">
        <button className="text-white bg-slate-600 rounded-lg p-2" onClick={createProject}>
          Create
        </button>
      </div>
      <div className="content-center w-full flex justify-center">
        <button className="text-white bg-slate-600 rounded-lg p-2" onClick={getProjects}>
          Get Project IDs
        </button>
      </div>
      <div className="content-center w-full flex justify-center">
        <button className="text-white bg-slate-600 rounded-lg p-2" onClick={getAllProjectsDetails}>
          Get All Projects Details
        </button>
      </div>
      <div className="content-center w-full flex flex-col items-center">
      <HStack spacing='24px'>
        {projects.map((project, index) => (
          <Box key={index} >
{/* 
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-500">{project.description}</p>
            <p className="text-gray-500">Creator: {project.creator}</p>
            <p className="text-gray-500">Deadline: {project.deadline}</p>
            <p className="text-gray-500">Goal Amount: {project.goalAmount}</p>
            <p className="text-gray-500">Raised Amount: {project.raisedAmount}</p> */}


                    <Card maxW='sm'>
            <CardBody>
             
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{project.name}</Heading>

                Description:
                <Text>
                  {project.description}
                </Text>
                Creator
                <Text color='blue.600'>
               {project.creator}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
             <Button onClick={fundProject}>
              Fund idea
             </Button>
            </CardFooter>
          </Card>
          </Box>


          
        ))}
        </HStack>
      </div>
    </div>
  );
}

export default page