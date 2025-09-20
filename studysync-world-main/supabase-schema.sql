-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'junior' CHECK (role IN ('admin', 'mentor', 'junior')),
  profile_pic TEXT,
  age INTEGER DEFAULT 18,
  college TEXT,
  stream TEXT,
  available_for_mentorship BOOLEAN DEFAULT false,
  joined_communities TEXT[] DEFAULT '{}',
  joined_clubs TEXT[] DEFAULT '{}',
  connected_mentors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  club_head TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for communities
CREATE POLICY "Users can view all communities" ON communities FOR SELECT USING (true);
CREATE POLICY "Admins can manage communities" ON communities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for clubs
CREATE POLICY "Users can view all clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Admins can manage clubs" ON clubs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for chat_rooms
CREATE POLICY "Users can view all chat rooms" ON chat_rooms FOR SELECT USING (true);
CREATE POLICY "Users can create chat rooms" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins can manage chat rooms" ON chat_rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create policies for messages
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Admins can manage messages" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, profile_pic)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO communities (id, name, description, member_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'GLA University', 'Official community for GLA University students and alumni', 1250),
  ('550e8400-e29b-41d4-a716-446655440001', 'IIT Delhi', 'Connect with IIT Delhi students and faculty', 2300)
ON CONFLICT (id) DO NOTHING;

INSERT INTO clubs (id, name, description, community_id, club_head, member_count) VALUES
  ('650e8400-e29b-41d4-a716-446655440000', 'Tech Innovators', 'For students passionate about technology and innovation', '550e8400-e29b-41d4-a716-446655440000', 'Dr. Sarah Smith', 45),
  ('650e8400-e29b-41d4-a716-446655440001', 'AI Research Group', 'Exploring the frontiers of Artificial Intelligence', '550e8400-e29b-41d4-a716-446655440000', 'Prof. John Doe', 32)
ON CONFLICT (id) DO NOTHING;
