-- Migration: Create contact_messages table
-- Run this SQL to add support for the contact form

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Add index for faster queries by creation date
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Add index for filtering unread messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read) WHERE is_read = false;
