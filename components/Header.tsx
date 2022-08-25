import {
    HStack,
    Text
} from '@chakra-ui/react';
import React, {useState} from 'react';
interface HeaderProps{
    title?: string,
    subtitle?: string,
    icon?: string
}
function Header({title, subtitle, icon}: HeaderProps) {
    return (
        <HStack bg={'#ffffff'} justify='space-between' minH='84px' px='20px'>
            <HStack>
                <Text fontSize={'20px'} fontWeight={500} color='#000000' >{title}</Text>
            </HStack>
            <HStack spacing='12px'>
            </HStack>
        </HStack>
    );
}

export default Header;