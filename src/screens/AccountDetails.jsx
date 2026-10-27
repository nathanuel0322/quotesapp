import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import FormInput from '../components/global/FormInput';
import { auth } from '../../firebase';
import ArrowLeftIcon from '../assets/icons/arrowlefticon.svg';
import { AuthContext } from '../components/global/AuthProvider';
import { useTheme } from '../components/global/ThemeContext';

export default function AccountDetails({ navigation }) {
  const [currentName, setCurrentName] = useState(auth.currentUser.displayName);
  const [saving, setSaving] = useState(false);
  const { colors } = useTheme();
  const { changeUsername } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[settingsstyles.topview,
        {backgroundColor: colors.header,  height: Globals.globalDimensions.height * .184729064}
      ]}>
        <TouchableOpacity style={[settingsstyles.backbutton, { backgroundColor: colors.accent }]} onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Back"
        >
          <ArrowLeftIcon width={30} height={30} color={colors.onAccent} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{color: colors.text, fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20}}>
            Account Details
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
        <Text style={[settingsstyles.settingspressablestext, { color: colors.text, marginBottom: '5%'}]}>Username</Text>
          <FormInput labelValue={currentName} onChangeText={setCurrentName} autoCapitalize="none" autoCorrect={false} />
          <TouchableOpacity style={[settingsstyles.changes, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }]} disabled={saving}
            onPress={async() => {
              Keyboard.dismiss();
              setSaving(true);
              const changed = await changeUsername(currentName);
              setSaving(false);
              setCurrentName(changed ? currentName.trim() : auth.currentUser.displayName);
            }}
          >
            <Text style={[settingsstyles.settingspressablestext, { color: colors.onAccent }]}>{saving ? 'Saving...' : 'Confirm Changes'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

const settingsstyles = StyleSheet.create({
  topview: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },

  settingspressables: {
    flexDirection: 'row', 
    marginLeft: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  settingspressablestext: {
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 18, 
    textAlign: 'center',
  },

  changes: {
    padding: 8,
    borderRadius: 12
  },

  backbutton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 16
  },
})
