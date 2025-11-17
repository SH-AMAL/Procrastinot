
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image, StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
const API_KEY = "AIzaSyC0p7cxIGyG93YRkYFpKQamRUKTtB1OYWI";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const COLORS = {
  darkIndigo: '#160A64',
  mainCardBg: '#FFFFFF',
  lightLilac: '#E0ABE7',
  vibrantPurple: '#9B59B6',
  textDark: '#000000',
  textLight: '#FFFFFF',
  grayText: '#6C757D',
  inputBg: '#F0F0F0',
  userBubbleBg: '#C0D9FF',
  darkPurple: '#6D28D9',
  starRating: '#FFA500', 
};
interface ChatMessage {
  role: 'user' | 'model'; 
  text: string;
}
const ICON_URLS = {
  support: require('../../assets/images/support.png'),
  settings: require('../../assets/images/settings.png'),
  home: require('../../assets/images/home.png'),
  calendar: require('../../assets/images/calendar.png'),
  chat: require('../../assets/images/chat.png'),
  star: require('../../assets/images/star.png'),
  aiSuggestions: require('../../assets/images/robot-guy.png'),
  edit: require('../../assets/images/edit.png'),
  title: require('../../assets/images/procrastinot-title.png'),
};
const initialChat: ChatMessage[] = [
  { role: 'model', text: "Hello! I am your AI assistant. I can help you manage and optimize your daily schedule based on your productivity goals. I am limited to 200 words." },
];
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  iconSmall: { width: 16, height: 16, marginRight: 5, borderRadius: 3 } as ImageStyle,
  iconLarge: { width: 30, height: 30, borderRadius: 5 } as ImageStyle,
  
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.darkIndigo,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  } as ViewStyle,
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.darkIndigo,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative', 
  } as ViewStyle,
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  headerTitleImage: {
    width: 200, 
    height: 30,
    resizeMode: 'contain', 
    marginRight: 10,
  } as ImageStyle,
  headerText: { 
    color: COLORS.textLight,
    fontSize: 24,
    fontWeight: '900', 
    letterSpacing: 2, 
    marginRight: 10, 
  } as TextStyle,
  menuIconBesideTitle: { 
    color: COLORS.textLight, 
    fontSize: 30,
  } as TextStyle,
  mainCard: {
    flex: 1,
    backgroundColor: COLORS.mainCardBg,
    overflow: 'hidden', 
    marginHorizontal: 0,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  } as ViewStyle,
  cardHeader: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  } as ViewStyle,
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  } as ViewStyle,
  rateStar: {
    fontSize: 18,
    color: COLORS.grayText, 
    marginRight: 5,
    fontWeight: '600', 
  } as TextStyle,
  rateText: {
    color: COLORS.grayText,
    fontSize: 14,
    fontWeight: '600', 
  } as TextStyle,
  dateRow: { 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
  } as ViewStyle,
  mainDateText: {
    fontSize: 22,
    fontWeight: 'bold', 
    color: COLORS.textDark,
  } as TextStyle,
  
  chatHistoryWrapper: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: COLORS.lightLilac,
    borderRadius: 10, 
    alignSelf: 'stretch', 
    overflow: 'hidden', 
    minHeight: 150, 
  } as ViewStyle,
  chatContainer: {
    paddingHorizontal: 15, 
    paddingVertical: 10,
    flexGrow: 1, 
  } as ViewStyle,
  
  messageWrapperBase: { 
    marginVertical: 8,
    maxWidth: '85%',
  } as ViewStyle,
  modelMessageWrapper: {
    alignSelf: 'flex-start',
  } as ViewStyle,
  userMessageWrapper: {
    alignSelf: 'flex-end',
  } as ViewStyle,
  modelMessageBubble: {
    backgroundColor: COLORS.mainCardBg,
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 3,
  } as ViewStyle,
  userMessageBubble: {
    backgroundColor: COLORS.userBubbleBg,
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 3,
  } as ViewStyle,
  messageText: {
    color: COLORS.darkPurple,
    fontSize: 15,
  } as TextStyle,
  modelMessageText: {
    color: COLORS.darkPurple,
    fontSize: 15,
  } as TextStyle,
  
  bottomArea: {
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: COLORS.mainCardBg,
  } as ViewStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8, 
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1, 
    borderColor: COLORS.grayText,
  } as ViewStyle,
  input: {
    flex: 1,
    minHeight: 40,
    fontSize: 16,
    color: COLORS.darkPurple,
  } as TextStyle,
  sendButton: {
    padding: 8,
  } as ViewStyle,
  sendIcon: {
    fontSize: 20,
    color: COLORS.vibrantPurple, 
  } as TextStyle,
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  } as ViewStyle,
  statusLink: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  statusTextLeft: {
    color: COLORS.vibrantPurple,
    fontWeight: 'bold', 
    fontSize: 14,
  } as TextStyle,
  statusTextRight: {
    color: COLORS.grayText,
    fontWeight: 'bold', 
    fontSize: 14,
  } as TextStyle,
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: COLORS.darkIndigo,
  } as ViewStyle,
  footerIconWrapper: {
    padding: 5,
  } as ViewStyle,
});
const fetchGeminiResponse = async (history: ChatMessage[], currentPrompt: string): Promise<string> => {
  const contents = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));
  const userQuery = { role: 'user', parts: [{ text: currentPrompt }] };
  const contentsWithNewQuery = [...contents, userQuery];
  const payload = {
    contents: contentsWithNewQuery,
  };
  const headers = { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || '';
};
export default function AIChatScreen() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChat);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', text: input.trim() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsLoading(true);
    const modelResponseText = await fetchGeminiResponse(newHistory, input.trim());
    const modelMessage: ChatMessage = { role: 'model', text: modelResponseText };
    setChatHistory(prev => [...prev, modelMessage]);
    
    setIsLoading(false);
  }, [input, isLoading, chatHistory]);
  const renderMessages = () => {
    return chatHistory.map((msg, index) => {
      const isUser = msg.role === 'user';
      return (
        <View 
          key={index} 
          style={[
            styles.messageWrapperBase,
            isUser ? styles.userMessageWrapper : styles.modelMessageWrapper
          ]}
        >
          <View style={isUser ? styles.userMessageBubble : styles.modelMessageBubble}>
            <Text style={isUser ? styles.messageText : styles.modelMessageText}>{msg.text}</Text>
          </View>
        </View>
      );
    });
  };
  const renderFooterNav = () => (
    <View style={styles.footerNav}>
      <View style={styles.footerIconWrapper}>
        <Image source={ICON_URLS.support} style={styles.iconLarge} />
      </View>
      <View style={styles.footerIconWrapper}>
        <Image source={ICON_URLS.settings} style={styles.iconLarge} />
      </View>
      <View style={styles.footerIconWrapper}>
        <Image source={ICON_URLS.home} style={styles.iconLarge} />
      </View>
      <View style={styles.footerIconWrapper}>
        <Image source={ICON_URLS.calendar} style={styles.iconLarge} />
      </View>
      <View style={styles.footerIconWrapper}>
        <Image source={ICON_URLS.chat} style={styles.iconLarge} />
      </View>
    </View>
  );
  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleWrapper}>
          <Image source={ICON_URLS.title} style={styles.headerTitleImage} />
          <Text style={styles.menuIconBesideTitle}>☰</Text>
        </View>
      </View>
      <View style={styles.mainCard}>
        
        <View style={styles.cardHeader}>
            <View style={styles.rateContainer}>
                <Image source={ICON_URLS.star} style={styles.iconSmall} />
                <Text style={styles.rateText}>Rate</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.mainDateText}>October 12, 2025</Text>
            </View>
        </View>
        
        <View style={styles.chatHistoryWrapper}> 
            <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContainer}
            keyboardShouldPersistTaps="handled"
            >
                {renderMessages()}
                {isLoading && (
                    <View style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
                        <ActivityIndicator size="small" color={COLORS.darkPurple} />
                    </View>
                )}
                <View style={{ height: 10 }} /> 
            </ScrollView>
        </View>
        <View style={styles.bottomArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask AI Assistant"
              placeholderTextColor={COLORS.grayText}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              editable={!isLoading}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading || !input.trim()}>
              <Text style={styles.sendIcon}>
                {'➤'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statusBar}>
            <View style={styles.statusLink}>
              <Image source={ICON_URLS.aiSuggestions} style={styles.iconSmall} />
              <Text style={styles.statusTextLeft}>AI Suggestions</Text>
            </View>
            
            <View style={styles.statusLink}>
              <Text style={styles.statusTextRight}>Edit</Text>
              <Image source={ICON_URLS.edit} style={{ ...styles.iconSmall, marginLeft: 5, marginRight: 0 }} />
            </View>
          </View>
        </View>
      </View>
      {renderFooterNav()}
    </View>
  );
}
