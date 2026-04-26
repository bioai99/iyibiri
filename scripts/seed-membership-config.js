const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// BUG-031 fix (Vol-14): TR character integrity restored across all NGO membership copy.
const configs = [
  {
    id: 'haytap',
    membership_description: 'Haytap gönüllüsü olarak sokak hayvanlarına yardım edebilirsin.',
    membership_form_fields: [
      { key: 'phone', label: 'Telefon', type: 'tel', required: true },
      { key: 'motivation', label: 'Neden gönüllü olmak istiyorsun?', type: 'textarea', required: false },
    ],
  },
  {
    id: 'ibb',
    membership_description: 'İBB Gönüllüleri programına katıl, İstanbul için fark yarat.',
    membership_form_fields: [
      { key: 'phone', label: 'Telefon', type: 'tel', required: true },
      { key: 'experience', label: 'Daha önce gönüllülük yaptın mı?', type: 'select', options: ['Evet', 'Hayır', 'Kısmen'], required: false },
    ],
  },
  {
    id: 'tema',
    membership_description: 'TEMA gönüllüsü ol, doğayı koru.',
  },
  {
    id: 'kizilay',
    membership_description: 'Kızılay gönüllüsü olarak insani yardıma katkıda bulun.',
  },
  {
    id: 'cydd',
    membership_description: 'ÇYDD gönüllüsü olarak eğitimde fırsat eşitliğine destek ver.',
  },
  {
    id: 'kodluyoruz',
    membership_description: 'Kodluyoruz mentoru ol, geleceği kodla.',
  },
]

async function seed() {
  for (const cfg of configs) {
    const update = {
      membership_enabled: true,
      membership_description: cfg.membership_description,
    }
    if (cfg.membership_form_fields) {
      update.membership_form_fields = cfg.membership_form_fields
    }
    const { error } = await supabase
      .from('ngos')
      .update(update)
      .eq('id', cfg.id)
    if (error) {
      console.error(`Error updating ${cfg.id}:`, error.message)
    } else {
      console.log(`Updated ${cfg.id}`)
    }
  }
  console.log('Done!')
}

seed()
