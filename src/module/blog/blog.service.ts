import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CommentsEntity } from './entities/comment.entity';
import { NotFoundMessage, publicMessage } from 'src/common/enums/message.enum';
import { createSlug, RandomId } from 'src/common/utils/functions.util';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { pagination } from 'src/common/decorators/pagination.decorator';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {



  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(CommentsEntity) private commentBlogRepository: Repository<CommentsEntity>
  ) { }



  // =====================   CREATE   ======================
  async create(createBlogDto: CreateBlogDto) {
    const adminJwt = this.request.admin
    let { category, content, description, image, slug, title } = createBlogDto

    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }

    let slugData = title ?? slug
    slug = createSlug(slugData)
    const isExist = await this.checkBlogBySlug(slug)
    if (isExist) {
      slug += `${RandomId}`
    }


    const imageInput = createBlogDto.image || [];
    let images: { url: string; publicId: string }[] = [];

    if (Array.isArray(imageInput)) {
      images = imageInput
        .filter(img => img && img.url && img.publicId)
        .slice(0, 5);
    }


    const blog = this.blogRepository.create({
      category,
      content,
      description,
      image: images,
      slug,
      title,
    })
    await this.blogRepository.save(blog)



    return {
      message: publicMessage.created
    }
  }







  // =====================   FIND ALL   ======================
  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [blog, count] = await this.blogRepository.findAndCount({
      skip,
      take: limit,
      order: { create_at: 'DESC' },
    })
    return {
      pagination: paginationGenerator(count, page, limit),
      blog
    }
  }






  // =====================   FIND ONE   ======================
  async findOne(id: number) {
    const blog = await this.blogRepository.findOneBy({ id })
    return blog
  }




  // =====================   UPDATE   ======================
  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const adminJwt = this.request.admin
    let { category, content, description, image, slug, title } = updateBlogDto
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }
    const blog = await this.blogRepository.findOneBy({ id })
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFound)


    if (slug) {
      const isExist = await this.checkBlogBySlug(slug)
      if (isExist && isExist.id !== id) {
        slug = slug + "-" + RandomId()
      }
    }
let imagesInput = updateBlogDto.image;

if (typeof imagesInput === "string") {
  try {
    imagesInput = JSON.parse(imagesInput);
  } catch {
    imagesInput = [];
  }
}

if (Array.isArray(imagesInput)) {
  const filtered = imagesInput.filter(i => i?.url && i?.publicId);
  blog.image = filtered.length > 0 ? filtered.slice(0, 5) : [];
}



    let slugData: string | null = null;

    if (title) {
      slugData = title
      blog.title = title
    }
    if (category) blog.category = category
    if (description) blog.description = description
    if (content) blog.content = content

    await this.blogRepository.save(blog)
    return {
      message: publicMessage.Update
    }
  }






  // =====================   REMOVE   ======================
  async remove(id: number) {
    const adminJwt = this.request.admin
    if (!adminJwt) {
      throw new NotFoundException(NotFoundMessage.NotFoundUser)
    }
    const blog=await this.blogRepository.findOneBy({id})
    if (!blog) {
      throw new NotFoundException(NotFoundMessage.NotFound)
    }
    await this.blogRepository.delete({ id })
    return {
      message: publicMessage.Delete
    }
  }





  // =====================   CHECK BLOG SLUG   ======================
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug })
    return blog
  }


}
