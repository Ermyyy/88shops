ALTER TABLE "UserCustomization"
ADD COLUMN "profileBackgroundColor" TEXT NOT NULL DEFAULT '#F6F6F4';

CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "editedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "readAt" TIMESTAMP(3),

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Conversation_productId_buyerId_sellerId_key"
ON "Conversation"("productId", "buyerId", "sellerId");

CREATE INDEX "Conversation_buyerId_updatedAt_idx"
ON "Conversation"("buyerId", "updatedAt");

CREATE INDEX "Conversation_sellerId_updatedAt_idx"
ON "Conversation"("sellerId", "updatedAt");

CREATE INDEX "Conversation_productId_idx"
ON "Conversation"("productId");

CREATE INDEX "Message_conversationId_createdAt_idx"
ON "Message"("conversationId", "createdAt");

CREATE INDEX "Message_senderId_idx"
ON "Message"("senderId");

CREATE INDEX "Message_readAt_idx"
ON "Message"("readAt");

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_buyerId_fkey"
FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_conversationId_fkey"
FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_senderId_fkey"
FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
