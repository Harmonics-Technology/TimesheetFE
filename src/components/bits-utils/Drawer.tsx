import {
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    Text,
    DrawerBody,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function DrawerWrapper({
    children,
    isOpen,
    onClose,
    title,
    sub,
}: {
    children: ReactNode;
    isOpen: any;
    onClose: any;
    title?: string;
    sub?: JSX.Element;
}) {
    return (
        <>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent maxW={['100%', '50%']} px="1rem">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" mt="1rem">
                        {title && <Text>{title}</Text>}
                        {sub && sub}
                    </DrawerHeader>
                    <DrawerBody my="1rem">{children}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
