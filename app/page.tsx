"use client"
import React, { useState, useEffect } from 'react'
import { CONTRACT_ADDRESS } from "./constants";
import { ABI } from "./constants";
import { ethers } from "ethers";
import Nav from "@/components/navbar"
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Box, Text,StackDivider, HStack, Button, Flex, Wrap, WrapItem, Link, Progress, Input, Divider} from '@chakra-ui/react'

import SmallWithLogoLeft from '@/components/footer';

declare global {
  interface Window {
    ethereum?: any
  }
}


const page = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [filterByCreator, setFilterByCreator] = useState(false); 

  const [fundAmounts, setFundAmounts] = useState<FundAmounts>({});
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
      console.log(idsResult)
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
    finished: boolean
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
        raisedAmount: project.raisedAmount,
        finished:project.finished
      };
    } catch (error) {
      console.error(`Error retrieving details for project ${projectId}:`, error);
      return null;
    }
  };
  
  const getAllProjectsDetails = async () => {
    try {
      const ids = await getProjects();
      const projectDetailsPromises = ids.map(id => getProjectDetails(id));
      let allProjectDetails = await Promise.all(projectDetailsPromises);
      
      // Filter projects based on the creator's address if filterByCreator is true
      if (filterByCreator) {
        const currentAddress = await getCurrentAddress();
        if (currentAddress) {
          allProjectDetails = allProjectDetails.filter(project => {
            if (project) {
              return project.creator.toLowerCase() === currentAddress.toLowerCase();
            }
            return false;
          });
        }
      }
  
      setProjects(allProjectDetails);
    } catch (error) {
      console.error('Error retrieving all projects details:', error);
    }
  };
  
  const getCurrentAddress = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return signer.address
    } catch (error) {
      console.error('Error getting current address:', error);
      return null;
    }
  };
  
  const toggleFilter = () => {
    setFilterByCreator(prevState => !prevState);
  };
  
  
  const fundProject = async (projectId: number) => {
    try {
      console.log("funding");
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("signer :", signer);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const amountInWei = ethers.parseEther(fundAmounts[projectId] || "0"); // Use the fund amount for the specific project ID
      const transaction = await contract.fundProject(projectId, {
        value: amountInWei, // Amount to fund the project (in ETH)
      });
  
      await transaction.wait();
      console.log("Project funded successfully!");
    } catch (error) {
      console.error("Error funding project:", error);
    } finally {
      setLoading(false);
    }

    incrementCount()
  };
  
  
  interface FundAmounts {
    [projectId: string]: string;
  }
  

  const handleFundAmountChange =  (projectId: string, value: string) => {
    setFundAmounts({
      ...fundAmounts,
      [projectId]: value,
    });
  };

  const withdrawFunds = async (projectId: number) => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  
      // Call the withdrawFunds function in your smart contract
      const transaction = await contract.withdrawFunds(projectId);
  
      // Wait for the transaction to be confirmed
      await transaction.wait();
  
      console.log("Funds withdrawn successfully for project with ID:", projectId);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    } finally {
      setLoading(false);
    }
    incrementCount()
  };
  
  
  useEffect(() => {
    getAllProjectsDetails();
  }, [filterByCreator, count]);


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

    <HStack p={5} spacing={2} justify={'center'}> 
    <Button  onClick={connectWallet}>
          connect Wallet
        </Button>

        <Button 
        as={Link}
href='/create'
        >
          Create
        </Button>


        <Button onClick={toggleFilter} colorScheme={filterByCreator ? 'yellow' : 'gray'} >
          {filterByCreator ? 'Show All Projects' : 'Show My Projects'}
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



<Card maxW='sm'  boxShadow='dark-lg' rounded='md'>
  <CardHeader>
    <Heading mb={2} size='lg'>{project.name}</Heading>
    <Divider/>
  </CardHeader>
  <CardBody>
    <Stack spacing='3'>
      <Text as={'b'}  >Description: </Text>
      
      <Text>{project.description} </Text>
      <Divider/>
      <Text fontSize='sm' >Creator: {project.creator}</Text>
      <Divider/>
      <Text fontSize='sm' >Deadline: {new Date(Number(project.deadline) * 1000).toLocaleString()}</Text>
      <Divider/>
      <Text fontSize='sm' >Goal Amount: {ethers.formatEther(project.goalAmount)} ETH</Text>
      <Divider/>
      <Text fontSize='sm' >Raised Amount: {ethers.formatEther(project.raisedAmount)} ETH</Text>
      <Divider/>
      <Text>Social Links:</Text>
      <Stack spacing='1'>
        {project.socialLinks.split(',').map((link:string, index:number) => (
          <Link my={3} key={index} href={link} target="_blank" rel="noopener noreferrer">{link}</Link>
        ))}
      </Stack>

      
    </Stack>
    <Divider/>
    <HStack mt={3} justify={"space-between"}>
      <Text mx={2}>{ethers.formatEther(project.raisedAmount)}</Text>
      <Text  mx={2}>{ethers.formatEther(project.goalAmount)}</Text>
    </HStack>
    <Progress rounded={'lg'} value={(parseFloat(ethers.formatEther(project.raisedAmount)) / parseFloat(ethers.formatEther(project.goalAmount))) * 100} />
  </CardBody>
  <CardFooter>
  {project.finished ? (
    <Text>Project is finished</Text>
  ) : (
    <HStack justify={"space-between"}>
      {filterByCreator ? (

<>
        <Button onClick={() => withdrawFunds(project.id)}
        isDisabled={Number(project.deadline) * 1000 > Date.now()}>Withdraw</Button>
        <Text hidden={Number(project.deadline) * 1000 < Date.now()}>Withdraw is only possible after the deadline is reached.</Text>
        </>


      ) : (
        <>
          <Box w={"60%"}>
            <Input
              type="number"
              placeholder="ETH"
              value={fundAmounts[project.id] || ''}
              onChange={(e) => handleFundAmountChange(project.id, e.target.value)}
            />
          </Box>
          <Button onClick={() => fundProject(project.id)}>Fund Idea</Button>
        </>
      )}
    </HStack>
  )}
</CardFooter>

</Card>

          </Box>
          </WrapItem>

          
        ))}
        </Wrap>
      </div>
      
      <SmallWithLogoLeft/>
    </div>
  );
}

export default page