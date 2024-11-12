// src/components/SettingsComponent.js
import React, { useState, useEffect } from "react";
import { FiMoon, FiSun, FiBell, FiGlobe, FiUser, FiSave } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast styling
import styles from "./Settings.module.css"; // Use module CSS to prevent global style conflicts


const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });
  const [accountSettings, setAccountSettings] = useState({
    username: "JohnDoe",
    email: "john@example.com",
    privacy: "public",
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDarkMode(parsed.darkMode);
      setLanguage(parsed.language);
      setNotifications(parsed.notifications);
      setAccountSettings(parsed.accountSettings);
    }
  }, []);
  const saveSettings = () => {
    try {
      const settings = {
        darkMode,
        language,
        notifications,
        accountSettings,
      };
      localStorage.setItem("userSettings", JSON.stringify(settings));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    }
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle(styles.dark);
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.settingsBox}>
        <h1 className={`${styles.header} ${styles.flex}`}>
          <FiUser className={styles.iconPrimary} /> Settings
        </h1>

        <div className={styles.sectionContainer}>
          {/* Theme Settings */}
          <section>
            <h2 className={`${styles.subHeader} ${styles.flex}`}>
              {darkMode ? (
                <FiMoon className={styles.iconPrimary} />
              ) : (
                <FiSun className={styles.iconSecondary} />
              )}
              Theme Preferences
            </h2>
            <div className={`${styles.switchContainer} ${styles.darkBg}`}>
              <span>Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className={`${styles.switchButton} ${
                  darkMode ? styles.switchActive : ""
                }`}
                role="switch"
                aria-checked={darkMode}
              >
                <span
                  className={`${styles.switchIndicator} ${
                    darkMode ? styles.activeIndicator : ""
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Language Settings */}
          <section>
            <h2 className={`${styles.subHeader} ${styles.flex}`}>
              <FiGlobe className={styles.iconSuccess} /> Language Settings
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.selectInput}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </section>

          {/* Notification Settings */}
          <section>
            <h2 className={`${styles.subHeader} ${styles.flex}`}>
              <FiBell className={styles.iconAlert} /> Notification Preferences
            </h2>
            <div className={styles.notificationsContainer}>
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className={`${styles.switchContainer} ${styles.darkBg}`}
                >
                  <span className={styles.capitalize}>{key} Notifications</span>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`${styles.switchButton} ${
                      value ? styles.switchActive : ""
                    }`}
                    role="switch"
                    aria-checked={value}
                  >
                    <span
                      className={`${styles.switchIndicator} ${
                        value ? styles.activeIndicator : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h2 className={`${styles.subHeader} ${styles.flex}`}>
              <FiUser className={styles.iconAccent} /> Account Settings
            </h2>
            <div className={styles.accountContainer}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                value={accountSettings.username}
                onChange={(e) =>
                  setAccountSettings({ ...accountSettings, username: e.target.value })
                }
                className={styles.input}
              />

              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={accountSettings.email}
                onChange={(e) =>
                  setAccountSettings({ ...accountSettings, email: e.target.value })
                }
                className={styles.input}
              />

              <label className={styles.label}>Privacy</label>
              <select
                value={accountSettings.privacy}
                onChange={(e) =>
                  setAccountSettings({ ...accountSettings, privacy: e.target.value })
                }
                className={styles.selectInput}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </section>

          {/* Save Button */}
          <div className={styles.saveButtonContainer}>
            <button onClick={saveSettings} className={styles.saveButton}>
              <FiSave />
              Save Settings
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Settings;




/*import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
export default function Example() {
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}>
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={{
                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
              }}
              style={styles.profileAvatar} />
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              <View style={styles.profileAction}>
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileAddress}>
            123 Maple Street. Anytown, PA 17101
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
              <FeatherIcon color="#fff" name="globe" size={20} />
            </View>
            <Text style={styles.rowLabel}>Language</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="moon" size={20} />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <View style={styles.rowSpacer} />
            <Switch
              onValueChange={darkMode => setForm({ ...form, darkMode })}
              value={form.darkMode} />
          </View>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
              <FeatherIcon
                color="#fff"
                name="navigation"
                size={20} />
            </View>
            <Text style={styles.rowLabel}>Location</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
              <FeatherIcon color="#fff" name="at-sign" size={20} />
            </View>
            <Text style={styles.rowLabel}>Email Notifications</Text>
            <View style={styles.rowSpacer} />
            <Switch
              onValueChange={emailNotifications =>
                setForm({ ...form, emailNotifications })
              }
              value={form.emailNotifications} />
          </View>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
              <FeatherIcon color="#fff" name="bell" size={20} />
            </View>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <View style={styles.rowSpacer} />
            <Switch
              onValueChange={pushNotifications =>
                setForm({ ...form, pushNotifications })
              }
              value={form.pushNotifications} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
              <FeatherIcon color="#fff" name="flag" size={20} />
            </View>
            <Text style={styles.rowLabel}>Report Bug</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="mail" size={20} />
            </View>
            <Text style={styles.rowLabel}>Contact Us</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
              <FeatherIcon color="#fff" name="star" size={20} />
            </View>
            <Text style={styles.rowLabel}>Rate in App Store</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
*/