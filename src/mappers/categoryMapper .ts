export class CategoryMapper {
  static toApi(category: any): any {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parent_id: category.parentId,
      description: category.description,
      status: category.status,
      image: {
        url: category.imageUrl,
        alt_text: category.imageAltText,
      },
      seo: {
        meta_title: category.metaTitle,
        meta_description: category.metaDescription,
        keywords: category.seoKeywords || [],
      },
      metadata: {
        display_order: category.displayOrder,
        is_featured: category.isFeatured,
      },
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static buildCategoryTree(categories: any[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];
    for (const category of categories) {
      map.set(category.id, {
        ...category,
        children: [],
      });
    }
    for (const category of categories) {
      const node = map.get(category.id);

      if (category.parent_id) {
        const parent = map.get(category.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  static findCategoryInTree(categories: any[], searchId: string): any | null {
    for (const category of categories) {
      if (category.id === searchId) {
        return category;
      }

      if (category.children?.length) {
        const result = this.findCategoryInTree(category.children, searchId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  static mapApiFieldsToDb(data: any): any {
    const mapped: any = {};

    if (data.name !== undefined) {
      mapped.name = data.name;
    }
    if (data.slug !== undefined) {
      mapped.slug = data.slug;
    }
    if (data.description !== undefined) {
      mapped.description = data.description;
    }
    if (data.status !== undefined) {
      mapped.status = data.status;
    }
    if (data.parent_id !== undefined) {
      mapped.parentId = data.parent_id;
    }
    if (data.image_url !== undefined) {
      mapped.imageUrl = data.image_url;
    }
    if (data.image_alt_text !== undefined) {
      mapped.imageAltText = data.image_alt_text;
    }
    if (data.meta_title !== undefined) {
      mapped.metaTitle = data.meta_title;
    }
    if (data.meta_description !== undefined) {
      mapped.metaDescription = data.meta_description;
    }
    if (data.display_order !== undefined) {
      mapped.displayOrder = data.display_order;
    }
    if (data.is_featured !== undefined) {
      mapped.isFeatured = data.is_featured;
    }

    if (data.seo_keywords !== undefined) {
      const keywords = data.seo_keywords;
      if (typeof keywords === 'string') {
        mapped.seoKeywords = keywords.split(',').map((k: string) => k.trim());
      } else if (Array.isArray(keywords)) {
        mapped.seoKeywords = keywords;
      }
    }

    return mapped;
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
