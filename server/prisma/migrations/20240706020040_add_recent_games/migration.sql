-- CreateTable
CREATE TABLE "RecentGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "launchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
