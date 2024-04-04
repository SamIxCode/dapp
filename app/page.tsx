"use client"
import React, { useState, useEffect } from 'react'
import { CONTRACT_ADDRESS } from "./constants";
import { ABI } from "./constants";
import { ethers } from "ethers";
import Nav from "@/components/navbar"
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Box, Text,StackDivider,Divider, HStack, Button, Flex, Wrap, WrapItem, Link} from '@chakra-ui/react'

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
    id?: number
    creator: string;
    name: string;
    description: string;
    socialLinks: string[];
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
        id:projectId,
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
  
  const fundProject = async (projectId:number) => {
    try {
      console.log("funding")
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const transaction = await contract.fundProject(projectId, {
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
    <div 
    >
<div>
<Nav/>

</div>

    <HStack p={2} spacing={2} justify={'center'}> <Button  onClick={connectWallet}>
          connect Wallet
        </Button>

        <Button 
        as={Link}
href='/create'
        >
          Create
        </Button>

        <Button  onClick={getAllProjectsDetails}>
          Get All Projects Details
        </Button>
        </HStack>
      
      <div className="content-center w-full flex flex-col items-center">
      <Wrap justify="center" spacing={"30px"}>
        {projects.map((project, index) => (
           <WrapItem key={index}>
          <Box key={index} >



<Card maxW='sm'>
  <CardHeader>
    <Heading size='md'>{project.name}</Heading>
  </CardHeader>
  <CardBody>
    <Stack spacing='3'>
      <Text>Description: {project.description}</Text>
      <Text>Creator: {project.creator}</Text>
      <Text>Deadline: {new Date(Number(project.deadline) * 1000).toLocaleString()}</Text>
      <Text>Goal Amount: {ethers.formatEther(project.goalAmount)} ETH</Text>
      <Text>Raised Amount: {ethers.formatEther(project.raisedAmount)} ETH</Text>
      <Text>Social Links:</Text>
      <Stack spacing='1'>
        {project.socialLinks.split(',').map((link:string, index:number) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        ))}
      </Stack>

      <Text>
      {project.id}
      </Text>
    </Stack>
  </CardBody>
  <CardFooter>
    <Button onClick={() => fundProject(project.id)}>Fund Idea</Button>
  </CardFooter>
</Card>

          </Box>
          </WrapItem>

          
        ))}
        </Wrap>
      </div>
    </div>
  );
}

export default page