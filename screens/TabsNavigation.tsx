import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './Main';
import Messages from './Messages';
import Personal from './Personal';
import Settings from './Settings';
import Star from './Star';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const styleCreator = (isActive: boolean): StyleProp<ViewStyle> => ({
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: 30,
  top: isActive ? -10 : 5,
  backgroundColor: '#0F0F0F',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function TabsNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#665cd1',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'black',
          bottom: 0,
          height: 74,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Main}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styleCreator(focused)}>
              <Ionicons
                name="car-sport-sharp"
                size={35}
                color={focused ? color : 'white'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styleCreator(focused)}>
              <MaterialCommunityIcons
                name="message-outline"
                size={35}
                color={focused ? color : 'white'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Star"
        component={Star}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styleCreator(focused)}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={35}
                color={focused ? color : 'white'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Personal"
        component={Personal}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styleCreator(focused)}>
              <Octicons
                name="person"
                size={35}
                color={focused ? color : 'white'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styleCreator(focused)}>
              <MaterialCommunityIcons
                name="dots-horizontal-circle-outline"
                size={35}
                color={focused ? color : 'white'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
