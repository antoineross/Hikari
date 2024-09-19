import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createClient } from "@/utils/supabase/server";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().nullable() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await createClient()
        .from('posts')
        .insert({
          user_id: ctx.user.id,
          title: input.title,
          content: input.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      return data;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string().min(1), content: z.string().nullable() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await createClient()
        .from('posts')
        .update({ 
          title: input.title, 
          content: input.content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating post:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await createClient()
        .from('posts')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.user.id);

      if (error) {
        console.error("Error deleting post:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      return { success: true };
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await createClient()
        .from('posts')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      
      return data ?? [];
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await createClient()
        .from('posts')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (error) {
        console.error("Error fetching post by ID:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      return data;
    }),
});