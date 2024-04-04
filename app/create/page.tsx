"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../constants';
import { ABI } from '../constants';
import { Center, Heading, Text, FormControl, FormLabel, Input, Button, Box } from '@chakra-ui/react';

const CreateProjectPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [socialLinks, setSocialLinks] = useState(''); // Change to single string
    const [socialLink, setSocialLink] = useState(''); 
    const [renderedSocialLinks, setRenderedSocialLinks] = useState<string[]>([]);
    const handleCreateProject = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            // Convert goal amount to ethers
            const goalAmountInWei = ethers.parseEther(goalAmount);

            // Convert deadline to timestamp (in seconds)
            const deadlineTimestamp = Date.parse(deadline) / 1000;
            const socialLinksString = renderedSocialLinks.join(',');
            // Call the createProject function with the provided details
            const tx = await contract.createProject(
                name, 
                description, 
                socialLinksString, // Pass concatenated social links
                deadlineTimestamp, 
                goalAmountInWei
            );
            await tx.wait();
            alert('Project created successfully!');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };
    const handleAddSocialLink = () => {
        // Ensure the socialLink field is not empty
        if (socialLink.trim() !== '') {
            // Append the new social link to the array of links
            setRenderedSocialLinks(prevLinks => [...prevLinks, socialLink]);
            setSocialLink('');
        }
    };

    return (
        <Box p={8}>
            <Center>
                <Heading>Add your idea</Heading>
            </Center>
            <Center mt={4}>
                <Text>Ideas are always the start of something great. Present your ideas here and get crowdfunded on the blockchain.</Text>
            </Center>
            <form onSubmit={handleCreateProject}>
                <FormControl mt={6}>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Goal Amount (in ethers)</FormLabel>
                    <Input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Deadline</FormLabel>
                    <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Social Links</FormLabel>
                    <Input type="text" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
                    <Button type="button" onClick={handleAddSocialLink}>Add</Button>

                    {renderedSocialLinks.map((link: string, index: number) => (
    <li key={index}>{link}</li>
))}



                </FormControl>
                <Center mt={6}>
                    <Button colorScheme="blue" type="submit">Create Project</Button>
                </Center>
            </form>
        </Box>
    );
};

export default CreateProjectPage;
