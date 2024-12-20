import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import {Image, Pressable} from 'react-native';
import Icon from "react-native-remix-icon";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Logo from '@/assets/images/LogoStopBleeding.png';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabBackgroundSelected,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                headerShown: useClientOnlyValue(false, true),
                headerShadowVisible: false,
                headerTitle: '',
                tabBarShowLabel: false,
            }}
            >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({color}) => <Icon name={"home-3-fill"} size={35} color={color} style={{marginTop: 8}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginTop: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    tabBarIcon: ({color}) => <Icon name={"dossier-line"} size={35} color={color} style={{marginTop: 8}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginTop: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="qrcode"
                options={{
                    tabBarIcon: ({ color }) => <Icon name={"qr-code-line"} size={35} color={color} style={{marginTop: 8}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginTop: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color }) => <Icon name={'settings-5-line'} size={35} color={color} style={{marginTop: 8}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginTop: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
        </Tabs>
    );
}
