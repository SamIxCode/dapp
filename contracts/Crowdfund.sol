// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Project {
        address creator;
        string name;
        string description;
        string socialLinks;
        uint256 deadline;
        uint256 goalAmount;
        uint256 raisedAmount;
        mapping(address => bool) voters;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 projectId, address creator, string name, string description, uint256 deadline, uint256 goalAmount);
    event FundRaised(uint256 projectId, address backer, uint256 amount);
    event ProjectFunded(uint256 projectId, uint256 raisedAmount);
    event Vote(uint256 projectId, address voter, bool upvoted);

    modifier projectExists(uint256 projectId) {
        require(projectId > 0 && projectId <= projectCount, "Project does not exist");
        _;
    }

function createProject(
    string memory name,
    string memory description,
    string memory socialLinks,
    uint256 duration,
    uint256 goalAmount
) external {
    require(bytes(name).length > 0, "Project name must not be empty");
    require(bytes(description).length > 0, "Project description must not be empty");
    require(goalAmount > 0, "Goal amount must be greater than zero");

    uint256 deadline = block.timestamp + duration;

    projectCount++;
    Project storage newProject = projects[projectCount];
    newProject.creator = msg.sender;
    newProject.name = name;
    newProject.description = description;
    newProject.socialLinks = socialLinks; // Update social links assignment
    newProject.deadline = deadline;
    newProject.goalAmount = goalAmount;

    emit ProjectCreated(projectCount, msg.sender, name, description, deadline, goalAmount);
}



    function fundProject(uint256 projectId) external payable projectExists(projectId) {
        Project storage project = projects[projectId];
        require(project.deadline > block.timestamp, "Project deadline has passed");
        require(msg.value > 0, "Must send ether to fund the project");

        project.raisedAmount += msg.value;
        emit FundRaised(projectId, msg.sender, msg.value);

        if (project.raisedAmount >= project.goalAmount) {
            emit ProjectFunded(projectId, project.raisedAmount);
        }
    }





function withdrawFunds(uint256 projectId) external projectExists(projectId) {
    Project storage project = projects[projectId];
    require(project.creator == msg.sender, "Only the project creator can withdraw funds");
    require(project.deadline > block.timestamp, "Project deadline has passed");

    payable(msg.sender).transfer(project.raisedAmount);
    project.raisedAmount = 0;
}



    function getAllProjectIds() external view returns (uint256[] memory) {
    uint256[] memory ids = new uint256[](projectCount);
    for (uint256 i = 1; i <= projectCount; i++) {
        ids[i - 1] = i;
    }
    return ids;
}
}