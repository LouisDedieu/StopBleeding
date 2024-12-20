import React from 'react';
import { Tabs } from 'expo-router';
import {Image} from 'react-native';
import Icon from "react-native-remix-icon";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
// @ts-ignore
import Logo from '@/assets/images/LogoStopBleeding.png';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabBackgroundSelected,
                tabBarInactiveBackgroundColor: '#fffcfc',
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                headerShown: useClientOnlyValue(false, true),
                headerShadowVisible: false,
                headerTitle: '',
                tabBarShowLabel: false,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].tintBackground,
                },
                tabBarStyle: {
                    flex: 0.08
                },
            }}
            >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({color}) => <Icon name={"home-3-fill"} size={35} color={color} style={{marginTop: '80%'}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginVertical: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    tabBarIcon: ({color}) => <Icon name={"dossier-line"} size={35} color={color} style={{marginTop: '80%'}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginVertical: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="qrcode"
                options={{
                    tabBarIcon: ({ color }) => <Icon name={"qr-code-line"} size={35} color={color} style={{marginTop: '80%'}}/>,
                    headerLeft: () => (
                        <Image
                            source={Logo}
                            style={{ marginLeft: 5, marginVertical: 5, height: 60, width: 60}}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color }) => <Icon name={'settings-5-line'} size={35} color={color} style={{marginTop: '80%'}}/>,
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
