import {
    Center,
    HStack,
    SimpleGrid,
    Stack,
    Table,
    Tbody,
    Td,
    Thead,
    Tr,
    Text,
    Badge,
    Button,
    useToast
} from "@chakra-ui/react";
import React, {useState} from "react";
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import {NextPage} from "next";
import {useQuery, useMutation, withWunderGraph} from "../../../components/generated/nextjs";
import CreateProject from "../../../components/CreateProject";
import EditProject from "../../../components/EditProject";
import {formatToCurrency} from "../../../helper/AppUtil";
import {EditProjectPropsHeadingStatus, UpdateProject} from "../../../helper/AppInterfaces";
import Loader from "../../../components/Loader";

const NewProjects: NextPage = () => {
    const toast = useToast();
    const projects = useQuery.GetProjectsByStatus({
        input: {
            status: {equals: "NEW"}
        }
    });

    const {mutate: updateProjectStatus} = useMutation.UpdateProjectStatus();
    const {mutate: archiveProject} = useMutation.UpdateArchiveStatus();

    const [createProject, setCreateProject] = useState<boolean>(false);
    const [editProject, setEditProject] = useState<boolean>(false);
    const [projectToBeEdited, setProjectToBeEdited] = useState<UpdateProject>(null);

    function cancelCreateProject() {
        setCreateProject(false);
    }

    function cancelEditProject() {
        setEditProject(false);
    }

    function enableCreateProject() {
        setEditProject(false);
        setCreateProject(true);
    }

    function enableEditProject(data) {
        let editProject: UpdateProject = {
            id: data.id,
            name: data.name,
            description: data.description,
            budget: data.budget
        }
        setProjectToBeEdited(editProject);
        setCreateProject(false);
        setEditProject(true);
    }

    function refetchProjects() {
        projects.refetch({
            input: {
                status: {equals: "NEW"}
            }
        })
    }

    function projectSaved() {
        refetchProjects();
        setCreateProject(false);
        setEditProject(false);
    }

    async function changeStatusToProgress(id: number) {
        let resp = await updateProjectStatus({
            input: {
                id: id,
                status: "PROGRESS"
            }
        })
        if (resp.status === "ok" && resp.data.db_updateOneProject) {
            toast({
                title: 'Success',
                description: "Project in progress",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            refetchProjects();
        } else {
            toast({
                title: "Error",
                description: "Oops, Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    async function archiveProjectStatus(id: number) {
        let resp = await archiveProject({
            input: {
                id: id,
                archived: {set: true}
            }
        })
        if (resp.status === "ok" && resp.data.db_updateOneProject) {
            toast({
                title: 'Success',
                description: "Project archived",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            refetchProjects();
        } else {
            toast({
                title: "Error",
                description: "Oops, Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    if (projects.result.status === "error") {
        return (<Text fontSize={"18px"} size={"xl"}>Error...</Text>)
    }
    if (projects.result.status !== "ok") {
        return (<Loader/>)
    }
    return (
        <>
            <SimpleGrid gap='22px'>
                <Stack>
                    <Stack
                        bg='white'
                        boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25)'}
                        borderColor={'#9FA2B4'}
                    >
                        <HStack borderBottom={'1px solid #DFE0EB'} p='14px'>
                            <Text fontSize={'16px'} fontWeight='700'>New Projects</Text>
                            <AddIcon onClick={enableCreateProject} cursor={"pointer"}/>
                        </HStack>
                        {projects.result.status === "ok" && (
                            <Stack
                                maxH={"85vh"}
                                overflow={"scroll"}
                                p='16px'>
                                <Table variant={'unstyled'}>
                                    <Thead>
                                        <Tr borderBottom={'1px solid #DFE0EB'} fontWeight={'700'} fontSize='14px'>
                                            <Td>Id</Td>
                                            <Td>Name</Td>
                                            <Td>Description</Td>
                                            <Td>Budget</Td>
                                            <Td>Date</Td>
                                            <Td>Status</Td>
                                            <Td>Actions</Td>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {projects.result.data["db_findManyProject"].map((data) =>
                                            <Tr
                                                key={data.id}
                                                fontWeight={'700'} fontSize='14px'
                                                borderBottom={'1px solid #DFE0EB'}
                                            >
                                                <Td>
                                                    <Center
                                                        p={2}
                                                        h='40px' border={'1px solid #9FA2B4'} borderRadius='8px'>
                                                        {data.id}
                                                    </Center>
                                                </Td>
                                                <Td>
                                                    <Center
                                                        p={2}
                                                        minH='40px' border={'1px solid #9FA2B4'} borderRadius='8px'>
                                                        {data.name}
                                                    </Center>
                                                </Td>
                                                <Td>
                                                    <Center
                                                        p={2}
                                                        minH='40px' border={'1px solid #9FA2B4'} borderRadius='8px'>
                                                        {data.description}
                                                    </Center>
                                                </Td>
                                                <Td>
                                                    <Center
                                                        p={2}
                                                        minH='40px' border={'1px solid #9FA2B4'} borderRadius='8px'>
                                                        ${formatToCurrency(data.budget)}
                                                    </Center>
                                                </Td>
                                                <Td>
                                                    <Center
                                                        p={2}
                                                        h='40px' border={'1px solid #9FA2B4'} borderRadius='8px'>
                                                        {new Date(data.createdAt).toISOString().split('T')[0]}
                                                    </Center>
                                                </Td>
                                                <Td ml={"10px"}>
                                                    <Badge ml={"10px"} colorScheme='purple'>{data.status}</Badge>
                                                </Td>
                                                <Td>
                                                    <Stack
                                                        spacing={"10px"} isInline>
                                                        <Button onClick={() => {
                                                            changeStatusToProgress(data.id)
                                                        }} bg={"green.300"} size={"sm"}>Start</Button>
                                                        <Button onClick={() => {
                                                            archiveProjectStatus(data.id)
                                                        }} bg={"blue.300"} size={"sm"}>Archive</Button>

                                                        <EditIcon
                                                            onClick={() => {
                                                                enableEditProject(data)
                                                            }}
                                                            alignSelf={'center'} fontSize={'16px'} cursor={"pointer"}
                                                        />
                                                    </Stack>
                                                </Td>
                                                <Td></Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </SimpleGrid>
            {createProject && (
                <CreateProject
                    isOpen={createProject}
                    onClose={cancelCreateProject}
                    onSuccess={projectSaved}
                />
            )}
            {editProject && (
                <EditProject
                    status={EditProjectPropsHeadingStatus.NEW}
                    isOpen={editProject}
                    onClose={cancelEditProject}
                    onSuccess={projectSaved}
                    defaultValues={projectToBeEdited}
                />
            )}
        </>
    )
}
export default withWunderGraph(NewProjects);