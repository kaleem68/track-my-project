import {Center, HStack, SimpleGrid, Stack, Table, Tbody, Td, Thead, Tr, Text, useToast} from "@chakra-ui/react";
import React from "react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {NextPage} from "next";
import {useMutation, useQuery, withWunderGraph} from "../../../components/generated/nextjs";
const ArchivedProjects: NextPage = () => {
    const toast = useToast();
    const projects = useQuery.GetProjects();
    const {mutate: deleteItem, result: deletedItem} = useMutation.DeleteProject();
    async function deleteProject(id: number) {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (confirmDelete) {
            await deleteItem({
                input: {
                    id: id
                }
            })
            toast({
                title: 'Success',
                description: 'Project deleted',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            projects.refetch();
        }
    }
    return (
        <SimpleGrid gap='22px'>
            <Stack>
                <Stack bg='white' boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25)'}
                       borderRadius='8px'
                       border='1px solid #9FA2B4' borderColor={'#9FA2B4'}>
                    <HStack borderBottom={'1px solid #DFE0EB'} p='14px'>
                        <Text fontSize={'16px'} fontWeight='700'>Archived Projects</Text>
                    </HStack>
                    {projects.result.status === "ok" && (
                        <Stack p='16px'>
                            <Table variant={'unstyled'}>
                                <Thead>
                                    <Tr borderBottom={'1px solid #DFE0EB'} fontWeight={'700'}
                                        fontSize='14px'>
                                        <Td>Id</Td>
                                        <Td>Name</Td>
                                        <Td>Actions</Td>
                                        <Td></Td>
                                        <Td></Td>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {projects.result.data["db_findManyProject"].map((data, index) =>
                                        <Tr
                                            key={index}
                                            fontWeight={'700'} fontSize='14px'
                                            borderBottom={'1px solid #DFE0EB'}>
                                            <Td p='8px' mr='20px' w='181px'>
                                                <Center h='40px'
                                                        border={'1px solid #9FA2B4'}
                                                        borderRadius='8px'>
                                                    {data.id}
                                                </Center>
                                            </Td>
                                            <Td p='8px' mr='20px' w='181px'>
                                                <Center h='40px'
                                                        border={'1px solid #9FA2B4'}
                                                        borderRadius='8px'>
                                                    {data.name}
                                                </Center>
                                            </Td>
                                            <Td>
                                                <Stack
                                                    spacing={"10px"}
                                                    isInline>
                                                    <DeleteIcon
                                                        onClick={() => deleteProject(data.id)}
                                                        fontSize={'16px'}
                                                        cursor={"pointer"}/>
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
    )
}
export default withWunderGraph(ArchivedProjects);