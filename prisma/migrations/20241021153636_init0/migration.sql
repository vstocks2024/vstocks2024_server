-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "adminname" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageurl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" TEXT NOT NULL,
    "template_data" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_video" (
    "template_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_video_pkey" PRIMARY KEY ("template_id","video_id")
);

-- CreateTable
CREATE TABLE "template_image" (
    "template_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_image_pkey" PRIMARY KEY ("template_id","image_id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "video_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vectors" (
    "serial_no" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "license" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vectors_category" (
    "vector_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vectors_category_pkey" PRIMARY KEY ("vector_id","category_id")
);

-- CreateTable
CREATE TABLE "vectors_tag" (
    "vector_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vectors_tag_pkey" PRIMARY KEY ("vector_id","tag_id")
);

-- CreateTable
CREATE TABLE "vectors_url" (
    "serial_no" SERIAL NOT NULL,
    "vector_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "license" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vectors_url_pkey" PRIMARY KEY ("vector_id")
);

-- CreateTable
CREATE TABLE "animations" (
    "serial_no" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "animation_data" JSONB[],
    "canvas_data" JSONB[],
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animations_url" (
    "serial_no" SERIAL NOT NULL,
    "animation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "animation_data" JSONB[],
    "canvas_data" JSONB[],
    "likes" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animations_url_pkey" PRIMARY KEY ("animation_id")
);

-- CreateTable
CREATE TABLE "animations_category" (
    "animation_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animations_category_pkey" PRIMARY KEY ("animation_id","category_id")
);

-- CreateTable
CREATE TABLE "animations_tag" (
    "animation_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animations_tag_pkey" PRIMARY KEY ("animation_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_adminname_key" ON "admin_profiles"("adminname");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vectors_name_key" ON "vectors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vectors_url_name_key" ON "vectors_url"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vectors_url_url_key" ON "vectors_url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "animations_name_key" ON "animations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "animations_url_name_key" ON "animations_url"("name");

-- CreateIndex
CREATE UNIQUE INDEX "animations_url_thumbnail_url_key" ON "animations_url"("thumbnail_url");

-- AddForeignKey
ALTER TABLE "template_video" ADD CONSTRAINT "template_video_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_video" ADD CONSTRAINT "template_video_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_image" ADD CONSTRAINT "template_image_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_image" ADD CONSTRAINT "template_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vectors_category" ADD CONSTRAINT "vectors_category_vector_id_fkey" FOREIGN KEY ("vector_id") REFERENCES "vectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vectors_category" ADD CONSTRAINT "vectors_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vectors_tag" ADD CONSTRAINT "vectors_tag_vector_id_fkey" FOREIGN KEY ("vector_id") REFERENCES "vectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vectors_tag" ADD CONSTRAINT "vectors_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vectors_url" ADD CONSTRAINT "vectors_url_vector_id_fkey" FOREIGN KEY ("vector_id") REFERENCES "vectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animations_url" ADD CONSTRAINT "animations_url_animation_id_fkey" FOREIGN KEY ("animation_id") REFERENCES "animations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animations_category" ADD CONSTRAINT "animations_category_animation_id_fkey" FOREIGN KEY ("animation_id") REFERENCES "animations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animations_category" ADD CONSTRAINT "animations_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animations_tag" ADD CONSTRAINT "animations_tag_animation_id_fkey" FOREIGN KEY ("animation_id") REFERENCES "animations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animations_tag" ADD CONSTRAINT "animations_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
